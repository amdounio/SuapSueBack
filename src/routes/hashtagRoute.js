const hashtagController = require('../controllers/hashtagController');
const express = require('express');

const router = express.Router() ;


router.post("/addhashtag",hashtagController.addHashtag);
router.get("/getallhashtags",hashtagController.getallhashtags);
router.get("/getonehashtag/:id",hashtagController.getOneHashtagById);





module.exports = router ;