const connection = require('../database/db')


const getLoan = (req, res)=>{

    const sql = `select *, 
    if(status = 'entregue', 0, greatest(0, datediff(current_date(), prazo))) as dias_de_atraso, 
    if(status = 'entregue', 0, greatest(0, datediff(current_date(), prazo))) * 2 as valor_multa 
    from tb_emprestimos`

    connection.query(sql,(err, result)=>{
        if(err){
            return res.status(500).json(err)
        }
        return res.status(200).json(result)
    })  
    
}


const getOverdueLoan = (req, res)=>{

    connection.query(`select * from tb_emprestimos where status != 'entregue' and datediff(current_date(), prazo) > 0`, (err, result)=>{
        if (err){
            return res.status(500).json(err)
        }
        return res.status(200).json(result)
    })
}


const postLoan = (req, res)=>{
    const {user_id, livro_id} = req.body

    if(!user_id || !livro_id){
        return res.status(400).json({message:'missing info'})
    }

    connection.query('insert into tb_emprestimos (user_id, livro_id, criado_em, prazo) values (?,?,current_date(), date_add(current_date(), interval 7 day))', [user_id, livro_id],(err,result)=>{
        if(err){
            return res.status(500).json(err)
        }return res.status(200).json({message:'OK', result}) 
    })
}

const returnLoan = (req, res)=>{
    const {emprestimo_id} = req.params

    connection.query(`update tb_emprestimos set status = 'entregue' where emprestimo_id = ?`, [emprestimo_id] ,(err, result)=>{
        if(result.length === 0){
            return res.status().json({message:'not fund loan'})
        }
        else if(err){
            return res.status(500).json(err)
        }
        return res.status(200).json(result)
    })
}


module.exports = {
    getLoan,
    getOverdueLoan,
    postLoan,
    returnLoan
}