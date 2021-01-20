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
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach(el => delete queryObj[el])

    // 1B) Advance Filtering
    let queryStr = JSON.stringify(queryObj)

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log('queryStr', queryStr)

    const newQueryObj = JSON.parse(queryStr)

    let query = Tour.find(newQueryObj)

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
      // sort('price ratingsAverage)
    } else {
      query = query.sort('-createdAt')
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    // page=2&limit=10, 1-10, page 1, 11-20,page 2, 21-30, page 3
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip >= numTours) throw new Error('This page does not exist')
    }

    // var filterExample = { difficult: 'easy', duration: { $gte: 5 } }

    // const query =  Tour.find(
    //   {
    //     duration: 5,
    //     difficulty: 'easy'
    //   }
    // )

    // EXECUTE QUERY
    const tours = await query
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
    console.log('error:', error)

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
