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
    if(resposta.resposta==='masculino'){
        pessoas = pessoas.filter((pessoa)=>{
            if(pessoa.sexo==='masculino'){
                return pessoa
            }
        })
        
    }
    else if(resposta.resposta==='feminino'){
        pessoas = pessoas.filter((pessoa)=>{
            if(pessoa.sexo==='feminino'){
                return pessoa
            }
        })
    }
    else if(resposta.resposta==='info'){

    }
    else if(resposta.resposta==='adm'){

    }
    else if(resposta.resposta==='eletro'){

    }
    
    res.send(pessoas)
})


app.listen(port, () => {
    console.log('rodando na porta', port)
})