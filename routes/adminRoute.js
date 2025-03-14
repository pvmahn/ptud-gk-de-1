const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

const app = express();

router.get('/', adminController.getData);
router.post('/api/reset-password', adminController.resetPassword);
router.post('/api/block-user', adminController.blockUser);
router.post('/api/unblock-user', adminController.unblockUser);

module.exports = router;