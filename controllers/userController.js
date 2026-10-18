const connection = require('../database/db')

const getUsers = (req,res)=>{
    connection.query('select * from tb_users', (err,result)=>{
        if(err){
            return res.status(500).json(err)
        }
        return res.status(200).json(result)
    })
}

module.exports = {
    getUsers
}