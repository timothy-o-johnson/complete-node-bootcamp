const express = require('express')
const router = express.Router()
const tourController = require('./../controllers/tourController')

// router.param('id', tourController.checkId)
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addATour)

router
  .route('/:id')
  .get(tourController.getASingleTour)
  .patch(tourController.updateATour)
  .delete(tourController.deleteATour)

module.exports = router
