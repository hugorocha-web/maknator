import express from "express"



const app = express()
const port = process.env.PORT || 3000



app.use(express.json())

let pessoas = [
    {
        'nome':'rodrigo',
        'sexo':'masculino',
        'curso':'eletro'
    },
    {
        'nome':'josué',
        'sexo':'masculino',
        'curso':'adm'
    },
    {
        'nome':'paulo henrique',
        'sexo':'masculino',
        'curso':'info'
    }
]

app.post('/resposta', async (req, res)=>{
    let resposta = req.body
    res.send(resposta)
})


app.listen(port, () => {
    console.log('rodando na porta', port)
})