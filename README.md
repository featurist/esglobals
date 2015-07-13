# esglobals

Finds global variables in JavaScript code.

## Example

```JavaScript

var esglobals = require('esglobals');

function example() {
  x = y * z();
}

var js = example.toString();
esglobals(js);

// -> ['x', 'y', 'z']

```

## License

MIT
