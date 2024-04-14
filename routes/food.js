const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food_controller');

router.post('/', foodController.createFood);
router.patch('/:id', foodController.updateFoodById);
router.get('/', foodController.getAllFoods);
router.get('/:id', foodController.getFoodById);
router.put('/:id', foodController.updateFoodById);
router.delete('/:id', foodController.deleteFoodById);

module.exports = router;
