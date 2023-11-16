document.addEventListener("DOMContentLoaded", function () {
    const loggedIn = localStorage.getItem("loggedIn");
    const logoutButton = document.getElementById("logoutButton");
    const statusTelhadoElement = document.getElementById("statusTelhado");
    const quantidadeAguaElement = document.getElementById("quantidadeAgua");
    const previsaoTempoElement = document.getElementById("previsaoTempo");
    const temperaturaElement = document.getElementById("temperatura");
    const condicaoElement = document.getElementById("condicao");
    const iconCondicao = document.getElementById("iconCondisao");
    const background = Array.from(document.querySelectorAll('.background'))
    const telhado = document.getElementById('telhado')

    const data = new Date()
    let hora = data.getHours()
    
    // const probabilidadeChuvaElement = document.getElementById("probabilidadeChuva");


    if (!loggedIn) {
        // Se o usuário não estiver logado, redirecionar de volta para a página de login
        window.location.href = "index.html";
    }

    logoutButton.addEventListener("click", function () {
        // Limpar o token de autenticação (ou variável de sessão)
        localStorage.removeItem("loggedIn");
        // Redirecionar de volta para a página de login após o logout
        window.location.href = "index.html";
    });

    // Função para extrair o valor associado a um determinado tipo de status
    function parseStatus(data, tipo) {
        const regex = new RegExp(`${tipo}:\\s*(\\S+)`);
        const match = data.match(regex);
        return match ? match[1] : 'Dados não encontrados';
    }

    // Função para obter o texto correspondente ao status do telhado
    function getStatusTelhado(statusTelhado) {
        if(statusTelhado === '1'){
            telhado.src = './img/tetoAberto.png'
        } else {
            telhado.src = './img/tetoFechado.png'
        }
        return statusTelhado === '1' ? 'Telhado aberto' : 'Telhado fechado';
    }

    // Função para obter o texto correspondente ao status do recipiente
    function getStatusRecipiente(statusRecipiente) {
        return statusRecipiente === '1' ? 'Reservatório cheio' : 'Reservatório vazio';
    }

    // Função para atualizar os dados na página
    function updateData() {
        // Fazer uma solicitação para carregar os dados do arquivo
        fetch('dadosArduino.txt')
            .then(response => response.text())
            .then(data => {
                // Processar os dados e atualizar a página
                const statusTelhado = parseStatus(data, "Status do Telhado");
                const statusRecipiente = parseStatus(data, "Status do Recipiente");

                // Atualizar os elementos da página com os dados do Arduino
                statusTelhadoElement.textContent = getStatusTelhado(statusTelhado);
                // quantidadeAguaElement.textContent = getStatusRecipiente(statusRecipiente);
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));

        // Fazer uma solicitação para obter a previsão do tempo usando a API do OpenWeatherMap
        fetch('https://api.openweathermap.org/data/2.5/weather?q=Vitoria%20da%20Conquista&appid=56c20e15efb608aca80b4b7246c7b172&units=metric')
            .then(response => response.json())
            .then(weatherData => {
                // console.log(weatherData.main.temp)
                // Exibir apenas os números inteiros na temperatura
                const temperaturaInteira = parseInt(weatherData.main.temp);
                
                // Traduzir as condições meteorológicas
                const condicaoTraduzida = traduzirCondicao(weatherData.weather[0].main);

                // Atualizar o elemento da página com a previsão do tempo
                temperaturaElement.textContent = `${temperaturaInteira}°C`
                switch(condicaoTraduzida) {
                    case 'Céu Limpo':
                        if(hora >= 17 || hora <= 6){
                            iconCondicao.src = './img/noite.png'
                            for(i = 0; i < background.length; i++){
                            background[i].style.background = 'var(--noite)'
                            }
                        }else {
                            iconCondicao.src = './img/ensolarado.png'
                            for(i = 0; i < background.length; i++){
                                background[i].style.background = 'var(--ensolarado)'
                            }
                        }
                        break;
                    case 'Nublado':
                        iconCondicao.src = './img/nublado.png'
                        for(i = 0; i < background.length; i++){
                            background[i].style.background = 'var(--nublado)'
                        }
                        break;
                    case 'Chuva':
                        iconCondicao.src = './img/chuva.png'
                        for(i = 0; i < background.length; i++){
                            background[i].style.background = 'var(--chuva)'
                        }
                        break;
                    case 'Chuvisco':
                        iconCondicao.src = './img/chuvisco.png'
                        for(i = 0; i < background.length; i++){
                            background[i].style.background = 'var(--chuvisco)'
                        }
                        break;
                    case 'Tempestade':
                        iconCondicao.src = './img/tempestade.png'
                        for(i = 0; i < background.length; i++){
                            background[i].style.background = 'var(--tempestade)'
                        }
                        break;
                    case 'Neve':
                        iconCondicao.src = './img/neve.png'
                        for(i = 0; i < background.length; i++){
                            background[i].style.background = 'var(--neve)'
                        }
                        break;
                    case 'Nevoeiro':
                        iconCondicao.src = './img/Nevoeiro.png'
                        for(i = 0; i < background.length; i++){
                            background[i].style.background = 'var(--nevoeiro)'
                        }
                        break;
                    
                }
                condicaoElement.textContent = `${condicaoTraduzida}`
                // previsaoTempoElement.textContent = `Temperatura: ${temperaturaInteira}°C, Condição: ${condicaoTraduzida}`;

            })
            .catch(error => {
                console.error('Erro ao obter a previsão do tempo:', error);
                previsaoTempoElement.textContent = 'Erro ao obter a previsão do tempo';
            });
    }

    // Mapeamento para tradução das condições meteorológicas
    const traducoesCondicoes = {
        'clear': 'Céu Limpo',
        'clouds': 'Nublado',
        'rain': 'Chuva',
        'drizzle': 'Chuvisco',
        'thunderstorm': 'Tempestade',
        'snow': 'Neve',
        'mist': 'Nevoeiro'
    };

    // Função para traduzir a condição meteorológica
    function traduzirCondicao(condicao) {
        return traducoesCondicoes[condicao.toLowerCase()] || condicao;
    }

    // Chamar a função updateData assim que a página carregar
    updateData();

    // Atualizar os dados periodicamente (por exemplo, a cada 5 segundos)
    setInterval(updateData, 5000);
});
