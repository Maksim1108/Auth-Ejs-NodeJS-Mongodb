const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/signup', authController.signUp_get);
router.post('/signup', authController.signUp_post);

router.get('/login', authController.logIn_get);
router.post('/login', authController.logIn_post);

router.get('/logout', authController.logOut_get);

module.exports = router;
