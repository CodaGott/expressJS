const express = require('express');
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  updateUser,
} = require('../controllers/userController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`User id is: ${val}`);
  next();
});

// User Rounter

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
