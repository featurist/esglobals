var esprima = require('esprima');

function globalsUnder(node) {
  var globals = {};
  visit(node, {}, globals);
  return Object.keys(globals);
}

function visit(node, scope, globals) {
  if (node) { visitNode(node, scope, globals); }
}

var typeVisitors = {
  VariableDeclarator: function(node, scope, globals) {
    scope[node.id.name] = true;
    if (node.init) {
      visit(node.init, scope, globals);
    }
  },
  Identifier: function(node, scope, globals) {
    if (!scope[node.name]) { globals[node.name] = true; }
  },
  Property: function(node, scope, globals) {
    visitNode(node.value, scope, globals);
  },
  FunctionDeclaration: function(node, scope, globals) {
    visitFunction(node, scope, globals);
  },
  FunctionExpression: function(node, scope, globals) {
    visitFunction(node, scope, globals);
  },
  MemberExpression: function(node, scope, globals) {
    visitNode(node.object, scope, globals);
  },
  CatchClause: function(node, scope, globals) {
    if (node.param && typeof(node.param.name) == 'string') {
      visitNode(node.body, extendScope(scope, [node.param.name]), globals);
    }
    else {
      visitNode(node.body, scope, globals);
    }
  }
}

function extendScope(scope, extensions) {
  var newScope = {}
  var keys = Object.keys(scope).concat(extensions);
  for (var i = 0; i < keys.length; ++i) {
    newScope[keys[i]] = true;
  }
  return newScope;
}

function visitFunction(node, scope, globals) {
  visit (node.body, extendScope(scope, namesOf(node.params).concat('arguments')), globals);
}

function visitNode(node, scope, globals) {
  var typeVisitor = typeVisitors[node.type];
  if (typeVisitor) {
    return typeVisitor(node, scope, globals);
  } else if (node instanceof Array) {
    return visitArray(node, scope, globals);
  } else if (node instanceof Object) {
    return visitObject(node, scope, globals);
  }
}

function visitArray(node, scope, globals) {
  for (var i = 0; i < node.length; ++i) {
    visit(node[i], scope, globals);
  }
}

function visitObject(node, scope, globals) {
  for (var key in node) {
    visit(node[key], scope, globals);
  }
}

function namesOf(nodes) {
  var names = [];
  for (var i = 0; i < nodes.length; ++i) {
    names[i] = nodes[i].name;
  }
  return names;
}

function findGlobalsIn(js) {
  var ast = esprima.parse(js);
  return globalsUnder(ast);
}

module.exports = findGlobalsIn;
