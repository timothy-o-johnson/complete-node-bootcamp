const Tour = require('../models/tourModels')

let toursDataBase = `${__dirname}/../dev-data/data/tours-simple.json`
// console.log( `path: ${toursDataBase} !`);

// const tours = JSON.parse(fs.readFileSync(toursDataBase))

exports.addATour = async (req, res) => {
  try {
    // const newId = null // tours.length
    // const newTour = Object.assign({ id: newId }, req.body)

    // Tour.create({}) = async(req, res)

    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid data set'
    })
  }
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

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getASingleTour = async (req, res) => {
  try {
    const id = req.params.id
    // console.log(`id: ${id}`)

    const tour = await Tour.findById(id)
    // Tour.find({ "_id" : id})

    res.status(200).json({
      status: 'success',
      results: 1,
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.updateATour = async (req, res) => {
  try {
    const { id } = req.params

    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
    // const keys = Object.keys(tour)
    // console.log(`keys: ${keys}`)
    // console.log(`tour.fields: ${tour._fields}`)
     console.log(`successful!`)

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })

    console.log(`successful!`)
  } catch (error) {
    // console.log(`error in updateATour: ${error}`)

    res.status(404).json({
      status: 'failed to update',
      message: error
    })
  }
}
