const multer = require("multer");
const path = require('path');

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/vnd.adobe.photoshop": "psd",
    "application/x-photoshop": "psd",
    "application/photoshop": "psd",
    "application/psd": "psd",
    "image/psd": "psd",
    "application/x-rar-compressed":"rar",
    "application/zip": "zip",
    "application/x-7z-compressed":"7z"

};
let error = null

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        // console.log(file)
        // const isValid = MIME_TYPE_MAP[file.mimetype];
        // let error = new Error("Mime type invalide");
        // if (isValid) {
        //     error = null;
        // }
        const mimeType = path.extname(file.originalname)
        console.log(mimeType);
        if (mimeType=='.psd'||mimeType=='.png'||mimeType=='.jpg'||mimeType=='.rar') {
            error = null
        }else{
           
            error = new Error("Invalid Mime Type")
        }
        cb(error, path.join(__dirname, '../../', 'images/artworkImages'));
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

module.exports = multer({ storage: storage }).fields([{ name: "Image"},{name:"untaged_artwork"},{name:"psd_file"}]);