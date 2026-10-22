const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const connection = require("../database/db");

const userLogin = (req, res)=>{
    const {email, senha} = req.body

    if(!email || !senha){
        return res.status(400).json({message:'missing info'})
    }

    const sql = `SELECT user_id, email, senha, tipo FROM tb_users WHERE email = ?`

    connection.query(sql, [email], (err,result)=>{
        if(err){
            return res.status(500).json(err)
        }if(result.length === 0){
            return res.status(400).json ({message:'no found user'})
        }
        bcrypt.compare(senha, result[0].senha, (err, isMatch)=>{
          if(err){
            return res.status(500).json(err)
          }if(!isMatch){
            return res.status(401).json({message:'email or password wrong'}) 
          }if(isMatch){
            const user = result[0]
            delete user.senha //remove a senha do json por seguranca 

            const SECRET_KEY = process.env.JWT_SECRET

            const token = jwt.sign(
              {
                user_id: user.user_id, email: user.email, tipo: user.tipo
              }, SECRET_KEY, 
              {expiresIn: '1d'}
            )

            return res.status(200).json({
              message:'login realizado',
              user,
              token
            })
          }
        })
    })

}


const getUsers = (req, res) => {

    const page = parseInt (req.query.page) || 1
    const limit = 10
    const offset = (page - 1) * limit

  connection.query("select * from tb_users limit ? offset ?", [limit, offset], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

const getUserId = (req , res)=>{
    const {user_id} = req.params
    connection.query('select * from tb_users where user_id = ?', [user_id],(err, result)=>{
        if(err){
            return res.status(500).json(err)
        }return res.status(200).json(result)
    })
}

const createUser = (req, res) => {
  const { name, email, senha, tipo, cpf, dt_nasc } = req.body;
  if (!name || !email || !senha || !cpf || !dt_nasc) {
    return res.status(400).json({ message: "missing info" });
  }

  const userRole = tipo || 'cliente'

  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) {
      return res.status(500).json(err);
    }
    connection.query(
    "insert into tb_users (name, email, senha, tipo, cpf, dt_nasc) values (?,?,?,?,?,?)",
    [name, email, hash, userRole, cpf, dt_nasc],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({ message: "created user", result });
    },
  );
  })

};

const updateUser = (req, res) => {
  const { user_id } = req.params;
  const { name, email, cpf, dt_nasc } = req.body;
  let fields = [];
  let values = [];

  if (name) {
    fields.push("name=?");
    values.push(name);
  }
  if (email) {
    fields.push("email=?");
    values.push(email);
  }
  if (cpf) {
    fields.push("cpf=?");
    values.push(cpf);
  }
  if (dt_nasc) {
    fields.push("dt_nasc=?");
    values.push(dt_nasc);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to Update" });
  }

  values.push(user_id);

  connection.query(
    `update tb_users set ${fields.join(",")} where user_id=?`,
    values,
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.status(200).json({ message: "user update", result });
    },
  );
};



const deleteUser = (req , res)=>{
    const {user_id} = req.params
    connection.query('delete from tb_users where user_id = ?', [user_id],(err, result)=>{
        if(err){
            return res.status(500).json(err)
        }else if(result.affectedRows === 0){
            return res.status(400).json({message:'no found user'})
        }return res.status(200).json({message:'user deleted',result})
    })
}


module.exports = {
  userLogin,
  getUsers,
  getUserId,
  createUser,
  updateUser,
  deleteUser
};
