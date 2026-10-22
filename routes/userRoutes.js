const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')


router.post('/login', userController.userLogin)
router.post('/', userController.createUser)

router.get('/', authMiddleware, isAdmin, userController.getUsers);


router.get('/:user_id', authMiddleware, userController.getUserId);
router.patch('/:user_id', authMiddleware, userController.updateUser)
router.delete('/:user_id', authMiddleware, userController.deleteUser)



module.exports = router 