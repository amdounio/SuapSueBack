const QuestionController = require("../controllers/questionController")
const express = require('express');
const router = express.Router() ;


router.post("/create",QuestionController.create);
router.get("/getall",QuestionController.getAll);
router.get("/getone/:id",QuestionController.getOne);

// router.get("/gettypeslimit",artTypeController.getAllartTypeLimit);
// router.delete("/deletetypes/:id",artTypeController.deleteType);






module.exports = router ;