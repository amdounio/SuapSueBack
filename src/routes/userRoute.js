const userController = require('../controllers/userController');
const express = require('express');
const personalimage = require('../midlleware/personalimage');
const router = express.Router() ;

router.post('/create',userController.create)
router.post('/update/:id',userController.update)
router.get('/getall',userController.getall)
router.get('/getone/:id',userController.getOne)
router.post('/auth/spid',userController.loginSpid)

// router.get('/getalluserwithLimit',userController.getallusersLimit)
// router.post('/add',personalimage,userController.add)
// router.post('/desactivate',userController.desactivateUser)
// router.post('/setadmin',userController.setAdmin)
// router.post('/completeprofile',userController.completeProfile)
// router.post('/completeprofile/updatephoto',personalimage,userController.updateUserPhoto)
// router.post('/updateprofile',userController.updateProfile)
// router.post('/addbalance',userController.addToBalance)



// router.post('/updatepass/',userController.updatePassword)
// router.post('/login',userController.auth)
// router.post('updateImage/:id',userController.updateImage)
// router.post('/forgotpassword',userController.forgotPass)
// router.post('/forgotpassword/resetpassword',userController.resetPassword)
// router.post('/validate_captcha',userController.validateCaptcha)

module.exports = router ;