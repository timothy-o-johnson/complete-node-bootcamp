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

const replaceTemplate = (template, product) => {
  console.log('*** template *** \n', template)
  console.log('*** product ***\n', product)
  
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%DESCRIPTION%}/g, product.quantity)
  output = output.replace(/{%ID%}/g, product.id)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%FROM%}/g, product.from)

  if (!product.organic) output = output.replace(/{%ORGANIC%}/g, `not-organic`)

  console.log('*** output ***\n', output)
  return output
}

const overviewTemplateHTML = fs.readFileSync(
  `${__dirname}/templates/overview-template.html`,
  'utf-8'
)
const cardTemplateHTML = fs.readFileSync(
  `${__dirname}/templates/card-template.html`,
  'utf-8'
)
const productTemplateHTML = fs.readFileSync(
  `${__dirname}/templates/product-template.html`,
  'utf-8'
)

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
  console.log('req', req.url)
  const pathName = req.url

  // Landing/Overview Page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    })

    const cardsHTML = dataObj.map(el => {
      return replaceTemplate(cardTemplateHTML, el)
    })

    const overviewHTML = overviewTemplateHTML.replace(/{%PRODUCT_CARDS%}/g, cardsHTML)

    // console.log(overviewHTML)

    res.end(overviewHTML)

    // Overview Template
  } else if (pathName === '/overview-template') {
    res.writeHead(200, {
      'Content-type': 'text/HTML',
      myOwnHeader: 'hello, world'
    })

    res.end(overviewTemplateHTML)

    // Dog
  } else if (pathName === '/dog') {
    res.end(`We've received '${pathName}' in 2nd block.`)

    // API
  } else if (pathName === '/api') {
    console.log('getting apiData...', apiData)

    res.writeHead(200, {
      'Content-Type': 'application/JSON',
      myOwnHeader: 'hello, world'
    })

    res.end(apiData)

    // Not Found
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
