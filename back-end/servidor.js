import express from "express"
import { randomUUID } from 'crypto'
import cors from "cors"
import { pessoas } from './pessoas.js'



const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())

let partidas = {}
let caracteristicas = [
    // Sexo
    { campo: "sexo", valor: "masculino", pergunta: "A pessoa é homem?" },
    { campo: "sexo", valor: "feminino", pergunta: "A pessoa é mulher?" },

    // Óculos
    { campo: "oculos", valor: true, pergunta: "A pessoa usa óculos?" },

    // Cabelo
    { campo: "cabelo", valor: "liso", pergunta: "A pessoa tem cabelo liso?" },
    { campo: "cabelo", valor: "cacheado", pergunta: "A pessoa tem cabelo cacheado?" },
    { campo: "cabelo", valor: "crespo", pergunta: "A pessoa tem cabelo crespo?" },
    { campo: "cabelo", valor: "ondulado", pergunta: "A pessoa tem cabelo ondulado?" },

    // Tamanho do cabelo
    { campo: "cabelo_tamanho", valor: "curto", pergunta: "A pessoa tem cabelo curto?" },
    { campo: "cabelo_tamanho", valor: "grande", pergunta: "A pessoa tem cabelo grande?" },

    // Cabelo pintado
    { campo: "cabelo_pintado", valor: true, pergunta: "A pessoa pinta o cabelo?" },

    // Aparelho
    { campo: "aparelho", valor: true, pergunta: "A pessoa usa aparelho?" },

    // Altura
    { campo: "altura", valor: "baixo", pergunta: "A pessoa é baixa?" },
    { campo: "altura", valor: "medio", pergunta: "A pessoa tem altura média?" },
    { campo: "altura", valor: "acima_media", pergunta: "A pessoa é um pouco mais alta que a média?" },
    { campo: "altura", valor: "alto", pergunta: "A pessoa é alta?" },

    // Barba e bigode
    { campo: "barba_bigode", valor: true, pergunta: "A pessoa tem barba ou bigode?" },

    // Esportes
    { campo: "esportes", valor: "futebol", pergunta: "A pessoa pratica futebol?" },
    { campo: "esportes", valor: "futsal", pergunta: "A pessoa pratica futsal?" },
    { campo: "esportes", valor: "vôlei", pergunta: "A pessoa pratica vôlei?" },
    { campo: "esportes", valor: "karatê", pergunta: "A pessoa pratica karatê?" },
    { campo: "esportes", valor: "muay thai", pergunta: "A pessoa pratica muay thai?" },
    { campo: "esportes", valor: "beach tennis", pergunta: "A pessoa pratica beach tennis?" },
    { campo: "esportes", valor: "musculação", pergunta: "A pessoa pratica musculação?" },

    // Videogame
    { campo: "videogame", valor: true, pergunta: "A pessoa joga videogame?" },

    // Participação
    { campo: "participa_atividades", valor: "sim", pergunta: "A pessoa participa das atividades da turma?" },
    { campo: "participa_atividades", valor: "pouco", pergunta: "A pessoa participa pouco das atividades?" },

    // Mochila e bolsa
    { campo: "mochila", valor: true, pergunta: "A pessoa usa mochila?" },
    { campo: "bolsa", valor: true, pergunta: "A pessoa usa bolsa?" },

    // Chegada
    { campo: "chegada", valor: "cedo", pergunta: "A pessoa costuma chegar cedo?" },
    { campo: "chegada", valor: "horario", pergunta: "A pessoa costuma chegar no horário?" },
    { campo: "chegada", valor: "nao_cedo", pergunta: "A pessoa costuma chegar atrasada ou não tão cedo?" },

    // Moletom
    { campo: "usa_moletom", valor: true, pergunta: "A pessoa costuma usar moletom?" },

    // Cargo
]


function avaliarCaracteristicas(pessoas, caracteristica){
    let sim = 0
    let nao = 0

    pessoas.forEach(pessoa => {
        let valorPessoa = pessoa[caracteristica.campo]

        if (valorPessoa === null || valorPessoa === undefined) {
            return
        }

        let corresponde

        if (Array.isArray(valorPessoa)) {
            corresponde = valorPessoa.includes(caracteristica.valor)
        } else {
            corresponde = valorPessoa === caracteristica.valor
        }

        if (corresponde) {
            sim++
        } else {
            nao++
        }
    })

    let diferenca = Math.abs(sim - nao)

    return {
        caracteristica,
        sim,
        nao,
        diferenca
    }

}
function escolherPergunta(candidatos){

    let list = []
    for(let i = 0; i < caracteristicas.length; i++){ 

        
        let caracteristica = avaliarCaracteristicas(candidatos, caracteristicas[i])
        list.push(caracteristica)

    }
    let menor = 100
    let pergunta;
    for(let i = 0; i < list.length; i++){
        console.log(list[i])
        
        if(list[i].diferenca < menor){
            menor=list[i].diferenca
            pergunta = list[i].caracteristica
        }
    }
    
    return pergunta
    
}


console.log(escolherPergunta(pessoas))

app.post('/comecar', async (req, res)=>{
    let newId = randomUUID()

    partidas[newId] = {
        candidatos: [...pessoas],
        perguntaAtual: escolherPergunta([...pessoas])
    }
        

    res.status(200).json({
        id: newId,
        pergunta: partidas[newId].perguntaAtual.pergunta
    })
    console.log(partidas)
})


app.post('/resposta', async (req, res) => {
    let resposta = req.body
    let id = resposta.id
    let pergunta = partidas[id].perguntaAtual
    console.log(pergunta)
    let campo = pergunta.campo
    let valor = pergunta.valor
    

    let corresponde
    partidas[id].candidatos = partidas[id].candidatos.filter(pessoa => {
        if (pessoa[campo] === null || pessoa[campo] === undefined) {
            return
        }
        if (Array.isArray(pessoa[campo])) {
            corresponde = pessoa.includes(pessoa[campo])
        }
        else{
            corresponde = pessoa[campo] === valor
        }
        if(resposta.resposta === 'sim'){
            return corresponde
        }
        else if(resposta.resposta === 'não'){
            return !corresponde
        }

    })
    
    

    if (partidas[id].candidatos.length === 1) {
        console.log('pessoa encontrada!', partidas[id])
    }
    else{
        partidas[id].perguntaAtual = escolherPergunta(partidas[id].candidatos)
    }

    res.json({

        partidas

    })
})


app.listen(port, () => {
    console.log('rodando na porta', port)
})