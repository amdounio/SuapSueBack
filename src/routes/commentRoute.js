const commentController = require('../controllers/commentController');
const express = require('express');
const tokenChecker = require('../midlleware/tokenCheck');

const router = express.Router() ;


router.post("/addcomment",commentController.addComment);
router.get("/getproductcomments/:id",commentController.getAllProductComment);





module.exports = router ;