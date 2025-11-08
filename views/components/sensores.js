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

// Função para formatar o tempo desde a última leitura (ainda não testado)!!!
function formatarTempoUltimaLeitura(timestamp) {
    const agora = new Date();
    const ultima = new Date(timestamp);
    const diferenca = agora - ultima;
    
    if (diferenca < 10000) { // menos de 10 segundos
        return 'AGORA';
    } else if (diferenca < 60000) { // menos de 1 minuto
        return Math.floor(diferenca / 1000) + ' seg atrás';
    } else if (diferenca < 3600000) { // menos de 1 hora
        return Math.floor(diferenca / 60000) + ' min atrás';
    } else {
        return Math.floor(diferenca / 3600000) + ' horas atrás';
    }
}

function criarCardSensor(sensor) {
    const status = determinarStatus(sensor.leituraPPM);
    const tempoFormatado = formatarTempoUltimaLeitura(sensor.ultimaLeitura);
    
    return `
        <a href="visualizacaoSensor.html?local_id=${sensor.id}" 
           class="block bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border-t-4 ${status.borda}">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-semibold text-gray-800">${sensor.nome}</h2>
                    <div class="flex items-center gap-2 ${status.texto} font-bold">
                        <div class="w-4 h-4 rounded-full ${status.bg}"></div>
                        <span>${status.status}</span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-500 mb-4">Sensor MQ-2: ${sensor.codigo}</p>

                <div class="pt-2 border-t border-gray-100">
                    <p class="text-gray-700">Leitura Atual: 
                        <span class="font-bold ${status.texto}">${sensor.leituraPPM} PPM</span>
                    </p>
                    <p class="${sensor.leituraPPM > 100 ? 'text-red-500 font-semibold' : 'text-gray-500'} text-sm">
                        Última leitura: ${tempoFormatado}
                    </p>
                </div>
            </div>
        </a>
    `;
}

// exemplos de dados de sensores, enquanto não ha banco
async function carregarSensores() {
    try {
        const sensores = [
            {
                id: 1,
                nome: "Cozinha Industrial",
                codigo: "MQFIRE-001",
                leituraPPM: 25,
                ultimaLeitura: Date.now() - 120000 // 2 minutos atrás
            },
            {
                id: 2,
                nome: "Sala de Servidores",
                codigo: "MQFIRE-002",
                leituraPPM: 80,
                ultimaLeitura: Date.now() - 10000 // 10 segundos atrás
            },
            {
                id: 3,
                nome: "Depósito 2A",
                codigo: "MQFIRE-003",
                leituraPPM: 250,
                ultimaLeitura: Date.now() // agora
            }
        ];

        const gridElement = document.getElementById('sensores-grid');
        gridElement.innerHTML = sensores.map(sensor => criarCardSensor(sensor)).join('');

    } catch (erro) {
        console.error('Erro ao carregar sensores:', erro);
    }
}

document.addEventListener('DOMContentLoaded', carregarSensores);

setInterval(carregarSensores, 30000);