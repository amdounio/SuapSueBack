const multer = require("multer");
const path = require('path');

const MIME_TYPE_MAP = {
    'audio/wav': 'wav',
    'audio/wav': 'wave',
    'audio/mpeg': 'mp3',
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Mime type invalide");
        if (isValid) {
            error = null;
        }
        cb(error, path.join(__dirname, '../../', 'products/media'));
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname) 
        const name = path.basename(file.originalname,ext)
            .toLowerCase()
            .split(" ")
            .join("-");
        console.log(name)
        const extt = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + extt);
    }
});

module.exports = multer({ storage: storage }).fields([{ name: "untaged_track"},{name:"taged_track"},{name:"Image"}]);