    require ('dotenv').config()
    const connection = require ('./database/db')
    const express = require('express')
    const cors = require ('cors')
    const app = express()
    const port = process.env.PORT || 3000 //porta reserva


    app.use(express.json())
    app.use(cors())

    app.get('/', (req, res)=>{
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
