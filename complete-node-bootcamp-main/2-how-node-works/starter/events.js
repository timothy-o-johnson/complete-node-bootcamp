const EventEmitter = require('events')
const http = require('http')

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

//// HTTP  example

const server = http.createServer()

server.on('request', (req, res) =>{
    console.log('Request received!')
    // res.end('Request received')
})

server.on('request', (req, res) =>{
    console.log('2nd request received!')
    res.end('Request received! :)')
})

server.listen(8000, '127.0.0.1',() =>{ console.log('Waiting (listening) for requests...');
})