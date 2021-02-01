const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true
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
      required: [true, 'A tour must have a difficulty']
    },
    rating: {
      type: Number,
      default: 4.5
    },
    ratingsAverage: {
      type: Number,
      default: 0
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
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
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
    startDates: [Date]
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
// tourSchema.pre('save', function(next){
//   console.log(`document pre middleware ${this}`);
//   this.slug =slugify(this.name, { lower: true})
//   next()
// })

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
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  
  // console.log(docs)

  next()
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
  console.log('mongoose aggregate middleware, pre...');
  this.pipeline().unshift({
    $match : {
      secretTour : {
        $ne: true
      }
    }
  })
  
  console.log(this);
  
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
