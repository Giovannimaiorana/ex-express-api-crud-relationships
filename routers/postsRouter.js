const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const routeNotFound = require("../middlewares/routeNotFound");
const { body } = require('express-validator');


router.get('/', postsController.index);
router.post('/',
    body("title").notEmpty().withMessage("devi inserire il titolo"),
    body("image").optional(),
    body("content").notEmpty().withMessage("devi inserire la descrizione"),
    body("published").isBoolean().optional().withMessage("deve essere un booleano"),
    body("name").notEmpty().withMessage("devi inserire il nome della category"),
    body("titleT").notEmpty().withMessage("devi inserire il nome dei tags"),
    postsController.store);
router.get('/:slug', postsController.show);
router.put('/:slug', postsController.update);
router.delete('/:slug', postsController.destroy);

router.use(routeNotFound);

module.exports = router;