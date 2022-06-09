const questionOptionController = require('../controllers/questionOptionController');
const express = require('express');

const router = express.Router() ;


router.post("/create",questionOptionController.create);
router.get("/getall",questionOptionController.getAll);
router.get("/getone/:id",questionOptionController.getOne);
// router.post("/update/:id",questionOptionController.updateMood)
// router.delete("/delete/:id",questionOptionController.deleteMood)





module.exports = router ;