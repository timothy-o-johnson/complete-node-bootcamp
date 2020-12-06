const EventEmitter = require('events')
const myEmitter = new EventEmitter()

myEmitter.on('newSale', () => {
    console.log('there was a new sale!');
})

myEmitter.on('newSale', () => {
    console.log('the customer\'s name was Tim!');
})

myEmitter.on('newSale', (unitsSold) => {
    console.log(`they purchased ${unitsSold} units`);
})

myEmitter.emit('newSale', 9)