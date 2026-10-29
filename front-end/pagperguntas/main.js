
const startButton = document.querySelector("#start-button");
const buttonLabel = document.querySelector("#button-label");
const statusMessage = document.querySelector("#status-message");

const API_URL = "http://localhost:3000/comecar";

startButton.addEventListener("click", async () => {
    startButton.disabled = true;
    buttonLabel.textContent = "Preparando partida...";
    statusMessage.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Não foi possível criar a partida.");
        }

        // Sua rota atual retorna o ID como texto.
        const idPartida = await response.text();

        if (!idPartida) {
            throw new Error("O servidor não retornou o ID.");
        }

        // Guarda o ID para a próxima tela do jogo.
        sessionStorage.setItem("macnatorIdPartida", idPartida);

        statusMessage.textContent =
            "Partida criada com sucesso!";

        buttonLabel.textContent = "Partida criada!";

        console.log("ID da partida:", idPartida);

    } catch (error) {
        console.error(error);

        statusMessage.textContent =
            "Erro ao conectar. Verifique se o servidor está rodando.";

        buttonLabel.textContent = "Tentar novamente";

    } finally {
        startButton.disabled = false;
    }
});
