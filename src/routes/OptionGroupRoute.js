const OptionGroupController = require('../controllers/OptionGroupController');
const express = require('express');
const router = express.Router() ;


router.post("/create",OptionGroupController.create);
router.get("/getall",OptionGroupController.getAll);
router.get("/getOne/:id",OptionGroupController.getOne);






module.exports = router ;