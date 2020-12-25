const express = require('express')
const router = express.Router()
const tourCotroller = require('./../controllers/tourController')

router
  .route('/')
  .get(tourCotroller.getAllTours)
  .post(tourCotroller.addATour)

router
  .route('/:id')
  .get(tourCotroller.getASingleTour)
  .patch(tourCotroller.updateATour)
  .delete(tourCotroller.deleteATour)

module.exports = router
