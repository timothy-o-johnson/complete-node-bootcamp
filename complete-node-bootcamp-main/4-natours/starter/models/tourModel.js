const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const User = require('./userModel')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must be less than or equal to 40 characters'],
      minlength: [10, 'A tour must be greater than or equal to 10 characters']
      // validate: [validator.isAlpha, 'tour must only contain characters']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty must be: easy, medium, or difficult'
      }
    },
    rating: {
      type: Number,
      default: 0.0
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Rating must be less than 5.0'],
      min: [1, 'Rating must be greater than 1.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price // only works on when creating a new document
        },
        message: 'price ({VALUE}) discount cannot be greater than the price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startDates: [Date],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [{
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }],
    guides: Array
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// virtual properties don't get stored in the data
//base and cannot be accessed as fields like regular
// fields

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// // DOCOMENT MIDDLEWARE, runs before .save() and .create()
tourSchema.pre('save', function(next){
  console.log(`document pre middleware ${this}`);
  this.slug =slugify(this.name, { lower: true})
  next()
})

tourSchema.pre('save', async function(next){
  
  const guidesPromises = this.guides.map(async id => User.findById(id))
  this.guides = await Promise.all(guidesPromises)
  next()
})

// tourSchema.pre('save', function(next){
//   console.log('document pre middleware: will save document now');
//   next()
// })

// tourSchema.post('save', function(doc, next){
//   console.log(`document post middleware, doc: ${doc}`);
//   next()
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  console.log('mongoose query middleware, pre find...')

  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()

  // console.log(this)

  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log('mongoose query middleware, post find...')
  console.log(`Query took ${Date.now() - this.start} milliseconds`)

  // console.log(docs)

  next()
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  console.log('mongoose aggregate middleware, pre...')
  this.pipeline().unshift({
    $match: {
      secretTour: {
        $ne: true
      }
    }
  })

  console.log(this)

  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
