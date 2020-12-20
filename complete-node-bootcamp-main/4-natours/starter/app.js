const { response } = require('express')
const express = require('express')
const fs = require('fs')

const app = express()
const port = 3000

app.use(express.json())

var toursDataBase = `${__dirname}/dev-data/data/tours-simple.json`

const tours = JSON.parse(fs.readFileSync(toursDataBase))

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

  res.status(204).json({
    status: 'success',
    data: null
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
  console.log(`App running on port ${port}...`)
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

app.get('/api/v1/tours', getAllTours)

app.post('/api/v1/tours', addATour)

app.get('/api/v1/tours/:id', getASingleTour)

app.patch('/api/v1/tours/:id', updateATour)

app.delete('/api/v1/tours/:id', deleteATour)

app.listen(port, setUpListener)
