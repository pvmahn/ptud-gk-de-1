const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const app = express();

router.get('/register', authController.register);
router.get('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/reset-password', authController.resetPassword);

router.post('/api/register', authController.submitRegister);
router.post('/api/login', authController.submitLogin);
router.post('/api/reset-password', authController.resetPasswordAction);

module.exports = router;
