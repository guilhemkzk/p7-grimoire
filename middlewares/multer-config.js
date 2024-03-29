const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const maxSize = 500000; // Limit size 500Ko

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/originals");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];

    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image");
