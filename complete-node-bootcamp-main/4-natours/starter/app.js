const { response } = require('express')
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')

const app = express()
const port = 3000

// (1) MIDDLEWARE
  // middleware is added in order
  // don't forget to call the next parameter
app.use(morgan('dev'))
app.use(express.json())
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

var toursDataBase = `${__dirname}/dev-data/data/tours-simple.json`

const tours = JSON.parse(fs.readFileSync(toursDataBase))

// (2) ROUTE HANDLERS
const addATour = (req, res) => {
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
}

const deleteATour = (req, res) => {
  const { id } = req.params
  const selectedTour = tours[id]

  if (!selectedTour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }

  res.status(418).json({
    status: 'success',
    data: {
      message: `${id} has been deleted`,
      requestedAt: req.requestTime
    }
  })
}

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}

const getASingleTour = (req, res) => {
  const { id } = req.params
  const selectedTour = tours[id]

  if (!selectedTour) {
    return res.status(404).json({
      status: 'failed',
      message: 'element not found'
    })
  }

  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      selectedTour
    }
  })
}

const setUpListener = () => {
  console.log(`App is running on port ${port}...`)
}

const updateATour = (req, res) => {
  const { id } = req.params
  const selectedTour = tours[id]

  if (!selectedTour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour...'
    }
  })
}

// (3) ROUTES

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(addATour)

app
  .route('/api/v1/tours/:id')
  .get(getASingleTour)
  .patch(updateATour)
  .delete(deleteATour)

  // (4) START SERVER
app.listen(port, setUpListener)
