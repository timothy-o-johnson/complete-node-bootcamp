const fs = require('fs')

let toursDataBase = `${__dirname}/../dev-data/data/tours-simple.json`
// console.log( `path: ${toursDataBase} !`);

const tours = JSON.parse(fs.readFileSync(toursDataBase))

exports.addATour = (req, res) => {
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

exports.checkBody = (req, res, next) => {
  const body = req.body
  console.log(`checkBody, body: ${JSON.stringify(body)}`)
  const containProps = body['name'] && body['price']

  if (!containProps) {
    return res.status(400).json({
      status: 'failed',
      message: `missing 'name' and 'price' properties`
    })
  }

  next()
}

exports.checkId = (req, res, next, val) => {
  const selectedTour = tours[val]

  // checkBody(req, res, next)
  console.log(`middleware is running!\ntour id is ${val}`)

  if (!selectedTour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }

  next()
}

exports.deleteATour = (req, res) => {
  res.status(418).json({
    status: 'success',
    data: {
      message: `${id} has been deleted`,
      requestedAt: req.requestTime
    }
  })
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}

exports.getASingleTour = (req, res) => {
  const { id } = req.params
  const selectedTour = tours[id]

  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      selectedTour
    }
  })
}

exports.updateATour = (req, res) => {
  const { id } = req.params

  res.status(200).json({
    status: 'success',
    data: {
      tour: `updated tour... ${id}`
    }
  })
}
