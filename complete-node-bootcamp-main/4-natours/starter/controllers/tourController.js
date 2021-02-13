const Tour = require('../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')

let toursDataBase = `${__dirname}/../dev-data/data/tours-simple.json`
// console.log( `path: ${toursDataBase} !`);

// const tours = JSON.parse(fs.readFileSync(toursDataBase))

exports.addATour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
})

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,difficulty'
  next()
}

exports.deleteATour = catchAsync(async (req, res) => {
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
})

exports.getAllTours = catchAsync(async (req, res, next) => {
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
})
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' } // set one field value to another field
    },
    { $project: { _id: 0 } }, // show/hide field: 0/1
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 6
    }
  ])

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan
    }
  })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
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
    {
      // our documents (results) fields have been updaed to reflect the fields
      $sort: { num: -1 }
    }
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
})

exports.getASingleTour = catchAsync(async (req, res, next) => {
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
})

exports.updateATour = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true // allows to rerun validator
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
})
