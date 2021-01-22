const Tour = require('../models/tourModels')
const APIFeatures = require('./../utils/apiFeatures')

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

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,difficulty'
  next()
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
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query
    // what we've been doing:  query.sort().select().skip().limit()

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
    console.log('error:', err)

    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
    // add await, or else returns aggregate object
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          // _id: '$ratingsAverage',
          num: { $sum: 1 }, // count for each tour
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { // our documents (results) fields have been updaed to reflect the fields
        $sort: { num: -1}
      },
      // {
      //   $match: { _id: {$ne: 'EASY'}}
      // }
    ])

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats
      }
    })
  } catch (err) {
    console.log('error:', err)

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
