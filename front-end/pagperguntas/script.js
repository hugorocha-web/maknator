
const API_URL = "http://localhost:3000"

const telaInicial = document.querySelector("#tela-inicial")
const telaJogo = document.querySelector("#tela-jogo")
const telaResultado = document.querySelector("#tela-resultado")
const telaSemCandidatos = document.querySelector("#tela-sem-candidatos")
const telaEsgotada = document.querySelector("#tela-esgotada")

const btnComecar = document.querySelector("#btn-comecar")
const btnSim = document.querySelector("#btn-sim")
const btnNao = document.querySelector("#btn-nao")
const btnPular = document.querySelector("#btn-pular")
const btnReiniciar = document.querySelector("#btn-reiniciar")
const btnNovoJogo = document.querySelectorAll(".btn-novo-jogo")

const elementoPergunta = document.querySelector("#pergunta")
const elementoContador = document.querySelector("#contador")
const barraProgresso = document.querySelector("#barra-progresso")
const mensagem = document.querySelector("#mensagem")

const imagemPessoa = document.querySelector("#imagem-pessoa")
const nomePessoa = document.querySelector("#nome-pessoa")

let idPartida = null
let quantidadeInicial = 0
let quantidadePerguntas = 0


function mostrarTela(tela) {
    const telas = [
        telaInicial,
        telaJogo,
        telaResultado,
        telaSemCandidatos,
        telaEsgotada
    ]

    telas.forEach(item => {
        item.classList.add("escondido")
    })

    tela.classList.remove("escondido")
}


function bloquearBotoes(bloquear) {
    btnSim.disabled = bloquear
    btnNao.disabled = bloquear
    btnPular.disabled = bloquear
}


async function comecarJogo() {
    try {
        btnComecar.disabled = true
        btnComecar.textContent = "Carregando..."

        const resposta = await fetch(`${API_URL}/comecar`, {
            method: "POST"
        })

        if (!resposta.ok) {
            throw new Error("Não foi possível iniciar o jogo.")
        }

        const dados = await resposta.json()

        idPartida = dados.id
        quantidadeInicial = dados.candidatos
        quantidadePerguntas = 0

        atualizarJogo(
            dados.pergunta,
            dados.candidatos
        )

        mostrarTela(telaJogo)

    } catch (erro) {
        alert(erro.message)
    } finally {
        btnComecar.disabled = false
        btnComecar.innerHTML = 'Começar jogo <span>→</span>'
    }
}


function atualizarJogo(pergunta, quantidadeCandidatos) {
    elementoPergunta.textContent = pergunta

    elementoContador.textContent =
        `${quantidadeCandidatos} ${quantidadeCandidatos === 1 ? "candidato" : "candidatos"}`

    quantidadePerguntas++

    const progresso = Math.min(
        (quantidadePerguntas / 30) * 100,
        100
    )

    barraProgresso.style.width = `${progresso}%`

    mensagem.textContent = ""
}


async function enviarResposta(respostaUsuario) {
    try {
        bloquearBotoes(true)
        mensagem.textContent = "Analisando respostas..."

        const resposta = await fetch(`${API_URL}/resposta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idPartida,
                resposta: respostaUsuario
            })
        })

        if (!resposta.ok) {
            throw new Error("Não foi possível enviar sua resposta.")
        }

        const dados = await resposta.json()

        const partida = dados.partidas[idPartida]

        if (!partida) {
            throw new Error("Não foi possível encontrar sua partida.")
        }

        verificarResultado(partida)

    } catch (erro) {
        mensagem.textContent = erro.message
    } finally {
        bloquearBotoes(false)
    }
}


function verificarResultado(partida) {
    const candidatos = partida.candidatos

    if (partida.status === "encontrada") {
        mostrarResultado(partida.pessoaEncontrada)
        return
    }

    if (partida.status === "sem_candidatos") {
        mostrarTela(telaSemCandidatos)
        return
    }

    if (partida.status === "perguntas_esgotadas") {
        mostrarTela(telaEsgotada)
        return
    }

    atualizarJogo(
        partida.perguntaAtual.pergunta,
        candidatos.length
    )
}


function mostrarResultado(pessoa) {
    nomePessoa.textContent = pessoa.nome

    imagemPessoa.src = pessoa.img
    imagemPessoa.alt = `Foto de ${pessoa.nome}`

    mostrarTela(telaResultado)
}


function reiniciarJogo() {
    idPartida = null
    quantidadeInicial = 0
    quantidadePerguntas = 0

    barraProgresso.style.width = "0%"
    mensagem.textContent = ""

    mostrarTela(telaInicial)
}


// Eventos

btnComecar.addEventListener("click", comecarJogo)

btnSim.addEventListener("click", () => {
    enviarResposta("sim")
})

btnNao.addEventListener("click", () => {
    enviarResposta("não")
})

btnPular.addEventListener("click", () => {
    enviarResposta("pular")
})

btnReiniciar.addEventListener("click", reiniciarJogo)

btnNovoJogo.forEach(botao => {
    botao.addEventListener("click", reiniciarJogo)
})
