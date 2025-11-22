export async function carregarSensor(sensorId) {
    try {
        const resp = await fetch(`/api/sensores/${sensorId}`);
        const sensor = await resp.json();
      
        document.getElementById("sala-nome").textContent = sensor.nome;
  
        document.getElementById("nivel-fumaca").textContent = sensor.nivel;

        const statusBolinha = document.getElementById("status-bolinha");
        const statusTexto = document.getElementById("status-texto");

        if (sensor.nivel > 200) {
            statusBolinha.className = "w-6 h-6 rounded-full bg-red-500";
            statusTexto.textContent = "Alerta";
            statusTexto.className = "text-xl text-red-500 font-medium";
        } else {
            statusBolinha.className = "w-6 h-6 rounded-full bg-green-500";
            statusTexto.textContent = "Estável";
            statusTexto.className = "text-xl text-gray-700 font-medium";
        }
    } catch (erro) {
        console.error("Erro ao carregar sensor:", erro);
    }
}

export async function carregarAlertas(sensorId) {
    try {
        const resp = await fetch(`/api/alertas/${sensorId}`);
        const alertas = await resp.json();

        const tbody = document.getElementById("alertas-tabela");
        tbody.innerHTML = alertas.map(a => `
            <tr class="text-gray-700 text-sm md:text-base">
                <td class="py-2 pr-4">${a.id}</td>
                <td class="py-2 px-4 ${a.nivel > 200 ? 'text-red-500' : 'text-green-500'} font-medium">
                    ${a.nivel > 200 ? 'Alerta' : 'Estável'}
                </td>
                <td class="py-2 pl-4">${new Date(a.dataHora).toLocaleString()}</td>
            </tr>
        `).join('');
    } catch (erro) {
        console.error("Erro ao carregar alertas:", erro);
    }
}

