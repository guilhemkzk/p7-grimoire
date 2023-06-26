const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const bookCtrl = require("../controllers/books");

// [POST] API BOOKS
router.post("/", auth, bookCtrl.createBook);
// [GET] API BOOKS
router.get("/", bookCtrl.getAllBooks);
// [GET] API BOOKS ID
router.get("/:id", bookCtrl.getOneBook);
// [GET] API BOOKS BESTRATING
router.get("/bestrating", auth, bookCtrl.bestRatings);
// [PUT] API BOOKS ID
router.put("/:id", auth, bookCtrl.updateBook);
// [DELETE] API BOOKS ID
router.delete("/:id", auth, bookCtrl.deleteBook);
// [POST] API BOOKS ID RATING
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
