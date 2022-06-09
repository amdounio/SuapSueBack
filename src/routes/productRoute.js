const productController = require('../controllers/productController');
const express = require('express');
const mediaUploader = require('../midlleware/mediaUploader');
const artworkImageUploader = require('../midlleware/artworkImageUploader');
const tokenChecker = require('../midlleware/tokenCheck');

const router = express.Router() ;
router.post('/check',tokenChecker.checkExpireToken)
router.post('/addartwork',artworkImageUploader,productController.addArtworkProduct)
router.post('/addlyrics',artworkImageUploader,productController.addLyricsProduct)
router.post('/addtrack',mediaUploader,productController.addTrackProduct)

//Get product by Id 
router.get('/getoneproduct/:id',productController.getProductById)
router.get('/getartProduct/:id',productController.getArtProductById)
router.get('/gettrackProduct/:id',productController.getTrackProductById)
router.get('/getlyricsProduct/:id',productController.getLyricsProductById)

//Get all products for each type
router.get('/getallartProduct/',productController.getAllArtProduct)
router.get('/getalltrackProduct/',productController.getAllTrackProduct)
router.get('/getalllyricsProduct/',productController.getAllLyricsProduct)
//Get all products
router.get('/getallProduct/',productController.getAllProduct)

//Get all user products
router.get('/getuserProducts/:id',productController.getUserProducts)
router.get('/userProductCount/:id',productController.countUserProducts)
router.get('/productCount',productController.countAllProducts)

//update product
router.post('/updateproduct/',productController.updateProduct)

//Add Likes
router.post('/addlike/',productController.addLike)
//Delete Product
router.delete('/deleteproduct/',productController.deleteProduct)

//Buy a product
router.post('/buyproduct/',productController.buyProduct)


//ADMIN PART
// get unaccepted products
router.get('/getUnacceptedwithlimit/',productController.getNotacceptedWithLimit)
router.get('/getUnaccepted/',productController.getNotaccepted)

router.post('/acceptproduct/',productController.acceptP)
router.get('/getpermonth',productController.countSelledProducts)
router.get('/sumselledp',productController.sumSelledProducts)
router.get('/usersofmonth',productController.getUsersOfTheMonth)
router.get('/pendingp',productController.getNumberNotAcceptedP)
router.get('/nbproducts',productController.numberOfProducts)
module.exports = router;