const InputTypeController = require('../controllers/inputTypeController');
const express = require('express');
const router = express.Router() ;


router.post("/create",InputTypeController.create);
router.get("/getall",InputTypeController.getAll);
router.get("/getOne/:id",InputTypeController.getOne);






module.exports = router ;