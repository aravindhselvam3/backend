const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleWare');

router.post('/signup', userController.signup);
router.get('/list', userController.getUserList);
router.post('/signin', userController.signin);

router.get('/profile', authMiddleware.verifyToken, userController.fetchUserProfile );
router.put('/profile', authMiddleware.verifyToken, userController.editProfile);
router.delete('/profile', authMiddleware.verifyToken, userController.deleteProfile);

module.exports = router;