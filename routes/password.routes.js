const express = require('express');
const router = express.Router();
const { requestReset, resetPassword } = require('../controllers/password.controller');


router.post('/request-reset', requestReset);


router.post('/reset-password/:id/:token', resetPassword);

module.exports = router;
