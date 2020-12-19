const express = require('express')
const fs = require('fs')

const app = express()
const port = 3000

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
    reslts: tours.length,
    data: {
      tours
    }
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
