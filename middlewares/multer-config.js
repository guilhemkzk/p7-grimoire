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

function uploadFile(req, res, next) {
  const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
  }).single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: err.message });
      // A Multer error occurred when uploading.
    }
    next();
  });
}

module.exports = uploadFile;
