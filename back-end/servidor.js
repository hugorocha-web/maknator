import express from "express"
import { randomUUID } from "crypto"
import cors from "cors"
import { pessoas } from "./pessoas.js"
import { caracteristicas } from "./caracteristicas.js"

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

let partidas = {}




function avaliarCaracteristicas(candidatos, caracteristica) {
    let sim = 0
    let nao = 0

    candidatos.forEach(pessoa => {
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


function escolherPergunta(candidatos, perguntasFeitas) {
    let disponiveis = caracteristicas.filter(caracteristica => {
        let jaFoiFeita = perguntasFeitas.some(pergunta => {
            return pergunta.campo === caracteristica.campo &&
                pergunta.valor === caracteristica.valor
        })

        return !jaFoiFeita
    })

    let list = []

    for (let i = 0; i < disponiveis.length; i++) {
        let resultado = avaliarCaracteristicas(candidatos, disponiveis[i])

        // Não escolhe perguntas sobre características desconhecidas por todos.
        if (resultado.sim + resultado.nao > 0) {
            list.push(resultado)
        }
    }

    let menor = Infinity
    let pergunta

    for (let i = 0; i < list.length; i++) {
        if (list[i].diferenca < menor) {
            menor = list[i].diferenca
            pergunta = list[i].caracteristica
        }
    }

    return pergunta
}


// Inicia uma partida
app.post("/comecar", (req, res) => {
    let newId = randomUUID()

    let candidatos = [...pessoas]
    let perguntaAtual = escolherPergunta(candidatos, [])

    partidas[newId] = {
        candidatos,
        perguntaAtual,
        perguntasFeitas: [],
        status: perguntaAtual ? "em_andamento" : "perguntas_esgotadas",
        pessoaEncontrada: null
    }

    res.status(200).json({
        id: newId,
        pergunta: perguntaAtual ? perguntaAtual.pergunta : null,
        candidatos: candidatos.length,
        status: partidas[newId].status
    })
})


// Recebe a resposta do jogador
app.post("/resposta", (req, res) => {
    let { id, resposta } = req.body

    let partida = partidas[id]

    if (!partida) {
        return res.status(404).json({
            erro: "Partida não encontrada."
        })
    }

    if (partida.status !== "em_andamento") {
        return res.status(400).json({
            erro: "Essa partida já foi encerrada."
        })
    }

    if (!["sim", "não", "pular"].includes(resposta)) {
        return res.status(400).json({
            erro: "Resposta inválida."
        })
    }

    let pergunta = partida.perguntaAtual

    if (!pergunta) {
        return res.status(400).json({
            erro: "Não existe uma pergunta atual."
        })
    }

    // Filtra os candidatos quando a resposta não é pular.
    if (resposta !== "pular") {
        let campo = pergunta.campo
        let valor = pergunta.valor

        partida.candidatos = partida.candidatos.filter(pessoa => {
            let valorPessoa = pessoa[campo]

            // Mantém candidatos com informação desconhecida.
            if (valorPessoa === null || valorPessoa === undefined) {
                return true
            }

            let corresponde

            if (Array.isArray(valorPessoa)) {
                corresponde = valorPessoa.includes(valor)
            } else {
                corresponde = valorPessoa === valor
            }

            if (resposta === "sim") {
                return corresponde
            }

            return !corresponde
        })
    }

    // Marca a pergunta atual como já utilizada.
    partida.perguntasFeitas.push(pergunta)

    // Verifica se não sobrou nenhum candidato.
    if (partida.candidatos.length === 0) {
        partida.status = "sem_candidatos"
        partida.perguntaAtual = null
    }

    // Verifica se encontrou uma única pessoa.
    else if (partida.candidatos.length === 1) {
        partida.status = "encontrada"
        partida.pessoaEncontrada = partida.candidatos[0]
        partida.perguntaAtual = null
    }

    // Se ainda existem vários candidatos, escolhe outra pergunta.
    else {
        partida.perguntaAtual = escolherPergunta(
            partida.candidatos,
            partida.perguntasFeitas
        )

        // Verifica se acabaram as perguntas disponíveis.
        if (!partida.perguntaAtual) {
            partida.status = "perguntas_esgotadas"
        }
    }

    // Retorna as partidas para o frontend.
    res.status(200).json({
        partidas
    })
})


app.listen(port, () => {
    console.log("rodando na porta", port)
})