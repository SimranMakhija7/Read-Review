const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/editprofile',authController.editprofile)

router.post('/registerbookshop',authController.registerbookshop)
router.post('/loginbookshop',authController.loginbookshop)

module.exports = router;