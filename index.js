    require ('dotenv').config()
    const connection = require ('./database/db')
    const express = require('express')
    const cors = require ('cors')
    const app = express()
    const port = process.env.PORT || 3000 //porta reserva
    const userRoutes = require('./routes/userRoutes')
    const bookRoutes = require('./routes/bookRoutes')
    const loanRoutes = require('./routes/loanRoutes')


    app.use(express.json())
    app.use(cors())
    app.use('/usuarios', userRoutes)
    app.use('/livros', bookRoutes)
    app.use('/emprestimos', loanRoutes)

    app.get('/', (req, res)=>{ //testar se a api ta dando retorno
        connection.query('SELECT 1', (err,result)=>{
            if(err){
                return res.status(500).json(err)
            }
            res.status(200).json(result)
        })
    })



    app.listen(port, ()=>{
        console.log(`running: http://localhost:${port}`)
    })
