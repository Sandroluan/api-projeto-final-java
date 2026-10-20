const express = require('express')
const router = express.Router()

const loanController = require('../controllers/loanController')

router.get('/atrasados', loanController.getOverdueLoan)
router.get('/', loanController.getLoan)
router.post('/', loanController.postLoan)
router.patch('/:emprestimo_id', loanController.returnLoan)


module.exports  = router

