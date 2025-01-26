# FlowDB

A simple, human-friendly, file-based key-value database for Node.js.

## Introduction

FlowDB provides a lightweight and easy-to-use way to persist data to a JSON file. It offers a simple API for common database operations like setting, getting, deleting, pushing to arrays, and basic mathematical operations. This is synchronous and asynchronous, making it suitable for large scale applications.

## Installation

```bash
npm install flow.db@latest
````

## Usage

```javascript
const { FlowDB } = require('flow.db');
/*
  For esm import use:
  import { FlowDB } from 'flow.db';
*/

/*
  For Asynchronous Operations, use:
  const { FlowDB } = require('flow.db/promises');

  For esm, use:
  import { FlowDB } from 'flow.db/promises';
*/
// Initialize the database (defaults to database.json in the same directory)
const db = new FlowDB();

// Or specify a custom file path:
const db2 = new FlowDB({ filePath: 'my_data.json' });

// Set a key-value pair
db.set('name', 'John Doe');
db.set('age', 30);
db.set('hobbies', ['reading', 'hiking']);

// Get a value
const name = db.get('name'); // Returns 'John Doe'
const age = db.get('age');   // Returns 30

// Check if a key exists
const hasName = db.has('name'); // Returns true

// Get all data
const allData = db.all(); // Returns { name: 'John Doe', age: 30, hobbies: ['reading', 'hiking'] }

// Delete a key
db.delete('age');

// Push to an array
db.push('hobbies', 'coding'); // hobbies is now ['reading', 'hiking', 'coding']

// Pull from an array
db.pull('hobbies', 'hiking'); // hobbies is now ['reading', 'coding']

// Add and Subtract Numbers
db.set('count', 10)
db.add('count', 5); // count is now 15
db.subtract('count', 3); // count is now 12

// Perform Mathematical operations
db.math('count', '*', 2); //count is now 24
db.math('count', '/', 4); //count is now 6
db.math('count', '+', 1); //count is now 7
db.math('count', '-', 2); //count is now 5
db.math('count', '%', 3); //count is now 2

// Backup and Restore
db.backup('my_backup'); // Creates my_backup.json
// ... later ...
db.restore('my_backup');

// Find a value in an array
db.set('users', [{ name: 'Alice', id: 1 }, { name: 'Bob', id: 2 }]);
const foundUsers = db.find('users', { name: 'Alice', id: 1 }); // Returns [{ name: 'Alice', id: 1 }]

// Find by property in an array of objects
const foundUserByProperty = db.findBy('users', 'id', 2); // Returns [{ name: 'Bob', id: 2 }]

// Map, Filter, Reduce and forEach array methods
db.set('numbers', [1, 2, 3, 4, 5]);
const doubledNumbers = db.map('numbers', num => num * 2); // Returns [2, 4, 6, 8, 10]
const evenNumbers = db.filter('numbers', num => num % 2 === 0); // Returns [2, 4]
const sum = db.reduce('numbers', (acc, num) => acc + num, 0); // Returns 15
db.forEach('numbers', (num) => console.log(num * 3)); // Logs 3, 6, 9, 12, 15

// Delete All Data
db.deleteAll();
```

## API

  * **`constructor(data = { filePath: "database.json" })`**: Creates a new FlowDB instance. `data.filePath` allows you to specify a custom database file path.
  * **`set(key, value)`**: Sets a key-value pair in the database.
  * **`get(key)`**: Retrieves the value associated with a key. Returns `undefined` if the key does not exist.
  * **`has(key)`**: Checks if a key exists in the database.
  * **`all()`**: Returns all data in the database as a plain JavaScript object.
  * **`delete(key)`**: Deletes a key-value pair from the database.
  * **`deleteAll()`**: Deletes all data from the database.
  * **`push(key, value)`**: Pushes a value to an array associated with the given key. Creates the array if it doesn't exist. Throws an error if the existing value is not an array.
  * **`pull(key, value)`**: Removes a specific value from the array associated with the given key. Does nothing if the key or value does not exist. Throws an error if the existing value is not an array.
  * **`add(key, value)`**: Adds a number to the value associated with the given key. Creates the value with 0 if it doesn't exist. Throws an error if the existing value is not a number.
  * **`subtract(key, value)`**: Subtracts a number from the value associated with the given key. Creates the value with 0 if it doesn't exist. Throws an error if the existing value is not a number.
  * **`math(key, operator, value)`**: Performs a mathematical operation (+, -, \*, /, %) on the value associated with the given key. Creates the value with 0 if it doesn't exist. Throws an error if the existing value is not a number or if the operator is invalid.
  * **`backup(fileName)`**: Creates a backup of the database file.
  * **`restore(fileName)`**: Restores the database from a backup file.
  * **`find(key, value)`**: Finds all occurrences of a value within an array stored under a given key.
  * **`findBy(key, property, value)`**: Finds all objects within an array (stored under a given key) where a specific property matches a given value.
  * **`map(key, callback)`**: Applies a callback function to each item in the array associated with the given key and returns a new array with the results.
  * **`filter(key, callback)`**: Creates a new array with all elements that pass the test implemented by the provided function.
  * **`reduce(key, callback, initialValue)`**: Executes a reducer function (that you provide) on each element of the array, resulting in single output value.
  * **`forEach(key, callback)`**: Executes a provided function once for each array element.

## Important Considerations (Synchronous Operations)

Because FlowDB uses synchronous file system operations, it will block the Node.js event loop while reading or writing to the database file. This can lead to performance issues in applications that handle many concurrent requests. For high-performance applications, it is strongly recommended to use the asynchronous version of FlowDB (`const { FlowDB } = require('flow.db/promises');` or `import { FlowDB } from 'flow.db/promises';`). Synchronous version is best suited for simple scripts, command-line tools, or situations where blocking I/O is acceptable.

## Contributing

Contributions are welcome\! Please open an issue or submit a pull request.

## License.

Apache-2.0

## Support

**For help or support, join our community on Discord.**

[![OpenDevsFlow Banner](https://api.weblutions.com/discord/invite/6UGYjhSS5v)](https://discord.gg/OpenDevsFlow/6UGYjhSS5v)
