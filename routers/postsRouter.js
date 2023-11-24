const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const routeNotFound = require("../middlewares/routeNotFound");


router.get('/', postsController.index);
router.post('/', postsController.store);
router.get('/:slug', postsController.show);
router.put('/:slug', postsController.update);
router.delete('/:slug', postsController.destroy);

router.use(routeNotFound);

module.exports = router;