const trackTypeController = require('../controllers/trackTypeController');
const express = require('express');
const tokenChecker = require('../midlleware/tokenCheck');

const router = express.Router() ;


router.post("/addtype",trackTypeController.addType);
router.get("/gettypes",trackTypeController.getAllartType);
router.get("/gettypeslimit",trackTypeController.getAllartTypeLimit);
router.delete("/deletetypes/:id",trackTypeController.deleteType)





module.exports = router ;