const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get('/', userController.getUsers);
router.get('/:user_id', userController.getUserId);
router.post('/', userController.createUser)
router.patch('/:user_id', userController.updateUser)
router.delete('/:user_id', userController.deleteUser)


module.exports = router 