const fs = require('fs')
const http = require('http')

// // Blocking, sychronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)

// const textOut = `this is what we konw about the avocado: \n\n'${textIn}'. \nCreated on ${Date.now()}`

// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written!')

// // Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//   console.log(`data1: ${data}`)
// })

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(`data2: ${data2}.. and this`)
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(`data3: ${data3}`)
//       fs.writeFile(
//         './txt/final.txt',
//         `${data1}\n${data2}\n${data3}\n`,
//         'utf-8',
//         err => {
//             console.log('data written to file! 🤓🤓🤓🤓')

//           console.log(`data4: ${err}`)
//         }
//       )
//     })
//   })
// })

////
//
// SERVER
//
////



const server = http.createServer((req, res) => {
  console.log('req', req.url)
  const pathName = req.url

  if (pathName === '/' || pathName === '/overview') {
    res.end(`We've received '${pathName}' in 1st block.`)
  } else if (pathName === '/dog') {
    res.end(`We've received '${pathName}' in 2nd block.`)
  } else if (pathName === '/api') {
   
    fs.readFile('./dev-data/data.json', 'utf-8', (err, devData) => {
     
      console.log(`data3: ${devData}`)

      res.writeHead(200, {
        'Content-Type': 'application/JSON',
        myOwnHeader: 'hello, world'
      })

      res.end(devData)
    })

  } else {
    res.writeHead(200, {
      // 'Content-Type': 'text/html',
      myOwnHeader: 'hello, world'
    })
    res.end(`<h1>Hello from the someplace unexpected! ('${pathName}')<h1>`)
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000')
})
