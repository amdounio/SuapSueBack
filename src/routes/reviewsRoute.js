const reviewController = require('../controllers/reviewsController');
const express = require('express');
const tokenChecker = require('../midlleware/tokenCheck');
const router = express.Router() ;


router.post('/addreview',reviewController.addReview)
router.get('/getallreviews/:id',reviewController.getAllReviews)


module.exports = router ;