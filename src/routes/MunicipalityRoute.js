const municipalityController = require("../controllers/municipalityController")
const express = require('express');
const router = express.Router() ;


router.post("/create",municipalityController.create);
router.get("/getall",municipalityController.getAll);
router.get("/getone/:id",municipalityController.getOne)







module.exports = router ;