const express = require('express')
const router = express.Router()

const userControler = require('../controllers/userController')

router.get('/', userControler.getUsers);


module.exports = router 