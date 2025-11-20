function determinarStatus(ppm) {
    if (ppm < 50) {
        return {
            status: 'Estável',
            cor: 'green',
            texto: 'text-green-600',
            bg: 'bg-green-500',
            borda: 'border-green-500'
        };
    } else if (ppm < 100) {
        return {
            status: 'Atenção',
            cor: 'yellow',
            texto: 'text-yellow-600',
            bg: 'bg-yellow-500',
            borda: 'border-yellow-500'
        };
    } else {
        return {
            status: 'Alerta!',
            cor: 'red',
            texto: 'text-red-600',
            bg: 'bg-red-500',
            borda: 'border-red-500'
        };
    }
}


function criarCardSensor(sensor) {

    return `
        <a href="visualizacaoSensor.html?local_id=${sensor.id}" 
           class="block bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">

            <div class="p-6">
                <h2 class="text-2xl font-semibold text-gray-800">${sensor.nomeSala}</h2>

                <p class="text-sm text-gray-500 mb-4">
                    Sensor MQ-2 - ID: ${sensor.identificador}
                </p>

                <div class="pt-2 border-t border-gray-100">
                    <p class="text-gray-500 text-sm">Clique para acessar o status atual da Sala</p>
                </div>
            </div>
        </a>
    `;
}


// exemplos de dados de sensores, enquanto não ha banco
async function carregarSensores() {
    try {
        // Faz a requisição ao backend
        const resposta = await fetch('/api/sensores'); 
        if (!resposta.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        // Converte para JSON
        const sensores = await resposta.json();

        const gridElement = document.getElementById('sensores-grid');
        gridElement.innerHTML = sensores.map(sensor => criarCardSensor(sensor)).join('');

    } catch (erro) {
        console.error('Erro ao carregar sensores:', erro);
    }
    }

document.addEventListener('DOMContentLoaded', carregarSensores);

setInterval(carregarSensores, 30000);