const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', newsController.getAllNews);


router.use(protect, restrictTo('ADMIN')); 

router.post('/', newsController.createNews);
router.patch('/:id', newsController.updateNews); 
router.delete('/:id', newsController.deleteNews);

module.exports = router;