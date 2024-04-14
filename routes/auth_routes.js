const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.get('/', authController.getAllUser);
router.get('/:id', authController.getUserById);
router.delete('/:id', authController.deleteUser);
router.patch('/:id', authController.updateUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
