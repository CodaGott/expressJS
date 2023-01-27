const express = require('express');
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const authController = require('../controllers/authenticationController.js');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, updateMe);
router.delete('/deleteMe', authController.protect, deleteMe);

router.param('id', (req, res, next, val) => {
  console.log(`User id is: ${val}`);
  next();
});

// User Router

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
