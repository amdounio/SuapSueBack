const surveySection = require("../controllers/surveySectionController")
const express = require('express');
const router = express.Router() ;


router.post("/create",surveySection.create);
router.get("/getall",surveySection.getAll);
router.get("/getsectionswithtype/:id",surveySection.getAllWithType)
// router.get("/gettypeslimit",artTypeController.getAllartTypeLimit);
// router.delete("/deletetypes/:id",artTypeController.deleteType);






module.exports = router ;