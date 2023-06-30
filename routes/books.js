const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/books");

// [POST] API BOOKS
router.post("/", auth, multer, bookCtrl.createBook);
// [GET] API BOOKS
router.get("/", bookCtrl.getAllBooks);
// [GET] API BOOKS BESTRATING
router.get("/bestrating", bookCtrl.bestRatings);
// [POST] API BOOKS ID RATING
router.post("/:id/rating", auth, bookCtrl.rateBook);
// [GET] API BOOKS ID
router.get("/:id", bookCtrl.getOneBook);
// [PUT] API BOOKS ID
router.put("/:id", auth, multer, bookCtrl.updateBook);
// [DELETE] API BOOKS ID
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
