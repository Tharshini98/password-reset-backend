const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.post('/request-reset', auth.requestReset);
router.post('/reset-password/:id/:token', auth.resetPassword);

module.exports = router;
