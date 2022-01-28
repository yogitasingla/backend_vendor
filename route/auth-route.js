const express = require('express');
const router = express.Router();
const config = require('../common/config-util');

const AuthController = require('../controllers/auth-controller');

const authController = new AuthController(config);
 

router.post('/login', authController.login);
router.post('/logout', authController.Logout);
router.post('/register', authController.register);
router.post('/token', authController.generateRandomToken);
router.get('/verify/:token', authController.verify);
router.post('/reset', authController.reset);
router.post('/reset/:token', authController.resetPassword);

module.exports = router;
