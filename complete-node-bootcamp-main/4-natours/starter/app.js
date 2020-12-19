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

var toursDataBase = `${__dirname}/dev-data/data/tours-simple.json`

const tours = JSON.parse(fs.readFileSync(toursDataBase))

// console.log(`tours ${JSON.stringify(tours)}`)

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

app.post('/api/v1/tours', (req, res) => {
  const newId = tours.length
  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)
  fs.writeFile(toursDataBase, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })
})

app.get('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params

  if (id > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'element not found'
    })
  }

  const selectedTour = tours[id]

  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      selectedTour
    }
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
