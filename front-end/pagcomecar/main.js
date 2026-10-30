
const startButton = document.querySelector("#start-button");
const buttonLabel = document.querySelector("#button-label");
const statusMessage = document.querySelector("#status-message");

const API_URL = "http://localhost:3000/comecar";

startButton.addEventListener("click", async () => {
    startButton.disabled = true;
    buttonLabel.textContent = "Preparando partida...";
    statusMessage.textContent = "";

    try {
        let response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (!response.ok) {
            throw new Error("Não foi possível criar a partida.");
        }

        // Sua rota atual retorna o ID como texto.
        const idPartida = await response.json();
        
        let id=idPartida.id
        console.log(id)

        if (!id) {
            throw new Error("O servidor não retornou o ID.");
        }

        // Guarda o ID para a próxima tela do jogo.
        sessionStorage.setItem("macnatorIdPartida", id);

        statusMessage.textContent =
            "Partida criada com sucesso!";

        buttonLabel.textContent = "Partida criada!";
        

        console.log("ID da partida:", id);

    } catch (error) {
        console.error(error);

        statusMessage.textContent =
            "Erro ao conectar. Verifique se o servidor está rodando.";

        buttonLabel.textContent = "Tentar novamente";

    } finally {
        startButton.disabled = false;
    }
});
