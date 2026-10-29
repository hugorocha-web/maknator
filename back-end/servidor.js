import express from "express"
import { randomUUID } from 'crypto'



const app = express()
const port = process.env.PORT || 3000



app.use(express.json())

let partidas = {}

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


app.post('/comecar', async (req, res)=>{
    let newId = randomUUID()

   partidas[newId]=[...pessoas]

    res.send(newId)
})

app.post('/resposta', async (req, res)=>{
    let resposta = req.body
    let id = resposta.id
    if(resposta.resposta==='masculino'){
        partidas[id] = partidas[id].filter((pessoa)=>{
            if(pessoa.sexo==='masculino'){
                return pessoa
            }
        })
        
    }
    else if(resposta.resposta==='feminino'){
        partidas[id] = partidas[id].filter((pessoa)=>{
            if(pessoa.sexo==='feminino'){
                return pessoa
            }
        })
    }
    else if(resposta.resposta==='info'){
        partidas[id] = partidas[id].filter((pessoa)=>{
            if(pessoa.curso==='info'){
                return pessoa
            }
        })

    }
    else if(resposta.resposta==='adm'){
        partidas[id] = partidas[id].filter((pessoa)=>{
            if(pessoa.curso==='adm'){
                return pessoa
            }
        })

    }
    else if(resposta.resposta==='eletro'){
        partidas[id] = partidas[id].filter((pessoa)=>{
            if(pessoa.curso==='eletro'){
                return pessoa
            }
        })

    }
    if (partidas[id].length===1){
        console.log('pessoa encontrada!', partidas[id])
    }

    
    res.send(partidas[id])
})


app.listen(port, () => {
    console.log('rodando na porta', port)
})