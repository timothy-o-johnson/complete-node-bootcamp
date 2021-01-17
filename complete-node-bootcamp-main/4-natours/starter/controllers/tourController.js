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
      message: err
    })
  }
}

exports.deleteATour = async (req, res) => {
  try {
    const id = req.params.id
    const deletedTour = await Tour.findOneAndDelete({ _id: id })

    res.status(418).json({
      status: 'success',
      data: {
        message: `${id} has been deleted`,
        requestedAt: req.requestTime,
        deletedTour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid data set',
      err
    })
  }
}

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach(el => delete queryObj[el])
    const query = Tour.find(queryObj)

    console.log(req.query, queryObj)

    // const query =  Tour.find(
    //   {
    //     duration: 5,
    //     difficulty: 'easy'
    //   }
    // )

    // EXECUTE QUERY
    const tours = await query

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy')

    // SEND RESPONSE

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
