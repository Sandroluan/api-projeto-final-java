const connection = require('../database/db')


const getLoan = (req, res)=>{

    const sql = `select
    e.emprestimo_id, 
    u.name as nome_usuario,
    l.titulo as titulo_livro,
    e.criado_em, 
    e.prazo,
    e.status,
    if(status = 'entregue', 0, greatest(0, datediff(current_date(), prazo))) as dias_de_atraso, 
    if(status = 'entregue', 0, greatest(0, datediff(current_date(), prazo))) * 2 as valor_multa 
    from tb_emprestimos e
    inner join tb_users u on e.user_id = u.user_id
    inner join tb_livros l on e.livro_id = l.livro_id
    limit ? offset ?
    `

    const page = parseInt (req.query.page) || 1
    const limit = 10
    const offset = (page - 1) * limit

    connection.query(sql,[limit, offset],(err, result)=>{
        if(err){
            return res.status(500).json(err)
        }
        return res.status(200).json(result)
    })  
    
}


const getOverdueLoan = (req, res)=>{

    const page = parseInt (req.query.page) || 1
    const limit = 10
    const offset = (page - 1) * limit

    const sql = `
    select
    e.emprestimo_id, 
    u.name as nome_usuario,
    l.titulo as titulo_livro,
    e.criado_em, 
    e.prazo,
    e.status,

    datediff(current_date(), e.prazo) AS dias_de_atraso,
    datediff(current_date(), e.prazo) * 2 AS valor_multa

    from tb_emprestimos e

    inner join tb_users u on e.user_id = u.user_id
    inner join tb_livros l on e.livro_id = l.livro_id
    
    where e.status != 'entregue' 
    and 
    datediff(current_date(), e.prazo) > 0
    limit ? offset ?
    `


    connection.query(sql, [limit, offset], (err, result)=>{
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