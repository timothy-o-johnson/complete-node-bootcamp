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

// better to create a class and extend the events

class NewSale extends EventEmitter {
    constructor(){
        super()
    }
}

const dogSale = new NewSale()
dogSale.on('newSale', () => {
    console.log('there was another new sale!');
})

dogSale.on('newSale', () => {
    console.log('the customer\'s name was Jim!');
})

dogSale.on('newSale', (unitsSold) => {
    console.log(`they purchased ${unitsSold} units`);
})

// better to create a class and ext
dogSale.emit('newSale', 10)