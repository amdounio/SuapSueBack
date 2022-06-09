const RoleController = require("../controllers/roleController")
const express = require('express');
const router = express.Router() ;


router.post("/create",RoleController.create);
router.get("/getall",RoleController.getAll);
router.get("/getone/:id",RoleController.getOne);
// router.get("/gettypeslimit",artTypeController.getAllartTypeLimit);
// router.delete("/deletetypes/:id",artTypeController.deleteType);






module.exports = router ;