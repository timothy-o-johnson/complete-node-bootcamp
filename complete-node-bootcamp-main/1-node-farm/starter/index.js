const fs = require('fs')

// Blocking, sychronous way
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn)

const textOut = `this is what we konw about the avocado: \n\n'${textIn}'. \nCreated on ${Date.now()}`

fs.writeFileSync('./txt/output.txt', textOut)
console.log('File written!')

// Non-blocking, asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  console.log(`data1: ${data}`)
})

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(`data2: ${data2}.. and this`)
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log(`data3: ${data3}`)
      fs.writeFile(
        './txt/final.txt',
        `${data1}\n${data2}\n${data3}\n`,
        'utf-8',
        err => {
            console.log('data written to file! 🤓🤓🤓🤓')
            
          console.log(`data4: ${err}`)
        }
      )
    })
  })
})
