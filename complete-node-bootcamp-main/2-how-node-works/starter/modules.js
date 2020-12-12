// // console.log('arguments: ', arguments);
// const args = Array.from(arguments)

// console.log('args',args);
// const wrapperFunction = require('module').wrapper 

// console.log('wrapperFunction', wrapperFunction);

// module.exports: for exporting just one item
// remember: no need for '.js' suffix for node require
const C = require('./test-module-1')

const calculator = new C
console.log(C.toString());

console.log(calculator.multiply(5, 2));
console.log(calculator.add(5, 2));
console.log(calculator.divide(5, 2.5));

// exports
// const calc2 = require("./test-module-2")

// console.log('calc2, multiply: ', calc2.multiply(5, 2));
// console.log('calc2, add: ', calc2.add(5, 2));
// console.log('calc2, divide: ', calc2.divide(5, 2.5));

const { multiply, add, divide } = require("./test-module-2")

console.log('multiply: ', multiply(5, 2));
console.log('add: ', add(5, 2));
console.log('divide: ', divide(5, 2.5));

// caching
require("./test-module-3")()
require("./test-module-3")()
require("./test-module-3")()