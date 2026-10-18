const connection = require("../database/db");
const { connect } = require("../routes/bookRoutes");

const getBook = (req, res) => {
  connection.query("select * from tb_livros", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

const getBookId = (req, res) => {
  const { livro_id } = req.params;
  connection.query(
    "select * from tb_livros where livro_id = ?",
    [livro_id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }return res.status(200).json(result)
    }
  );
};

const createdBook = (req, res) => {
  const { titulo, autor } = req.body;
  connection.query(
    "insert into tb_livros (titulo, autor) values (?,?)",
    [titulo, autor],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    },
  );
};

const updateBook = (req,res)=>{
  const { livro_id } = req.params;
  const { titulo, autor } = req.body;
  let fields = [];
  let values = [];

  if (titulo) {
    fields.push("titulo=?");
    values.push(titulo);
  }
  if (autor) {
    fields.push("autor=?");
    values.push(autor);
  }

  if(fields.length === 0){
    return res.status(400).json({message:'missing info'})
  }

  values.push(livro_id);

  connection.query(`update tb_livros set ${fields.join(",")} where livro_id=?`, values, (err, result)=>{
    if(err){
      return res.status(500).json(err)
    }return res.status(200).json({message:'book update', result})
  })
}

const deleteBook = (req,res)=>{
  const {livro_id} = req.params
  connection.query('delete from tb_livros where livro_id = ?', [livro_id], (err, result)=>{
    if(err){
      return res.status(500).json(err)
    }else if(result.affectedRows === 0){
      return res.status(404).json({message:'no found book'})
    }return res.status(200).json({message:'book deleted'})
  })
}


module.exports = {
  getBook,
  getBookId,
  createdBook,
  updateBook,
  deleteBook
};
