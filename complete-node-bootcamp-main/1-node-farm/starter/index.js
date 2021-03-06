const fs = require('fs')
const http = require('http')
const url = require('url')

const slugify = require('slugify')

console.log(slugify('many different avocados'))

const replaceTemplate = require('./modules/replaceTemplate')

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

const slugs = dataObj.map((el)=> { return slugify(el.productName,  {lower: true})})
console.log(slugs)

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true)

  // Landing/Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    })

    const cardsHTML = dataObj
      .map(el => {
        return replaceTemplate(cardTemplateHTML, el)
      })
      .join('')

    const overviewHTML = overviewTemplateHTML.replace(
      /{%PRODUCT_CARDS%}/g,
      cardsHTML
    )

    // console.log(overviewHTML)

    res.end(overviewHTML)

    // Overview Template
  } else if (pathname === '/overview-template') {
    res.writeHead(200, {
      'Content-type': 'text/HTML'
    })

    res.end(overviewTemplateHTML)

    // product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id]
    const productHTML = replaceTemplate(productTemplateHTML, product)
     res.writeHead(200, {
      'Content-type': 'text/HTML'
    })

    res.end(productHTML)

    // API
  } else if (pathname === '/api') {
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
    res.end(`<h1>Hello from the someplace unexpected! ('${pathname}')<h1>`)
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000')
})
