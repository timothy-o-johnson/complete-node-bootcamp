const express = require('express')
const fs = require('fs')

const app = express()
const port = 3000

app.use(express.json())

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'Natours' })
// })

// app.post('/', (req, res) => {
//   res.send(`you can post to this endpoint...`)
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

console.log(`tours ${JSON.stringify(tours)}`)

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

app.post('/api/v1/tours', (req, res) =>{
    var body = JSON.stringify(req.body)
    console.log(`req.body:\n ${body}`);
    res.status(200).send('hello, data has been posted')

})

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
