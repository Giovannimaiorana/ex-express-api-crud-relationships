const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const routeNotFound = require("../middlewares/routeNotFound");
const { body, param, query } = require('express-validator');

//validazioni fatte su rotta index 
router.get('/',
    query("published").optional().isBoolean().withMessage('Il parametro "published" deve essere un booleano'),
    query('content').optional().trim().escape(),
    postsController.index);

//validazioni fatte su rotta store 
router.post('/',
    body("title").notEmpty().withMessage("devi inserire il titolo"),
    body("image").optional(),
    body("content").notEmpty().withMessage("devi inserire la descrizione"),
    body("published").isBoolean().optional().withMessage("deve essere un booleano"),
    body("name").notEmpty().withMessage("devi inserire il nome della category"),
    body("titleT").notEmpty().withMessage("devi inserire il nome dei tags"),
    postsController.store);
//validazioni fatte su rotta show
router.get('/:slug',
    param("slug").isLength({ min: 2 }).withMessage("Lo slug deve essere lungo almeno 2 caratteri").isLength({ max: 50 }).withMessage("Lo slug  non deve superare i 50 caratteri"),
    postsController.show);
// validazioni da fare su eotta update    
router.put('/:slug',
    body('title').optional().isString().withMessage('Il titolo deve essere una stringa'),
    body('content').optional().isString().withMessage('Il contenuto deve essere una stringa'),
    body('published').optional().isBoolean().withMessage('Il campo "published" deve essere un booleano'),
    postsController.update);
//validazioni fatte su rotta delete 
router.delete('/:slug',
    param("slug").isLength({ min: 2 }).withMessage("Lo slug deve essere lungo almeno 2 caratteri").isLength({ max: 50 }).withMessage("Lo slug  non deve superare i 50 caratteri"),
    postsController.destroy);

router.use(routeNotFound);

module.exports = router;