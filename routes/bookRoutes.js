const express = require('express')
const router = express.Router()

const bookController = require('../controllers/bookController')

router.get('/', bookController.getBook);
router.get('/:livro_id', bookController.getBookId);
router.post('/', bookController.createdBook);
router.patch('/:livro_id', bookController.updateBook)
router.delete('/:livro_id', bookController.deleteBook)

module.exports = router