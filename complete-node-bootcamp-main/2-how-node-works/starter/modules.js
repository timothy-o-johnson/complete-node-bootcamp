// // console.log('arguments: ', arguments);
// const args = Array.from(arguments)

// console.log('args',args);
// const wrapperFunction = require('module').wrapper 

// console.log('wrapperFunction', wrapperFunction);

// module.exports: for exporting just one item
const C = require('./test-module-1') // no need for '.js'

const calculator = new C
console.log(C.toString());

console.log(calculator.multiply(5,2));
console.log(calculator.add(5,2));
console.log(calculator.divide(5,2.5));

