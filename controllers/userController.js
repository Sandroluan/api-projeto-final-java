const connection = require("../database/db");

const getUsers = (req, res) => {
  connection.query("select * from tb_users", (err, result) => {
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
  const { name, email, cpf, dt_nasc } = req.body;
  if (!name || !email || !cpf || !dt_nasc) {
    return res.status(400).json({ message: "missing info" });
  }
  connection.query(
    "insert into tb_users (name, email, cpf, dt_nasc) values (?,?,?,?)",
    [name, email, cpf, dt_nasc],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json({ message: "created user", result });
    },
  );
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
  getUsers,
  getUserId,
  createUser,
  updateUser,
  deleteUser
};
