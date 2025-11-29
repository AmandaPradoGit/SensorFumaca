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
function toDate(v) {
    if (v instanceof Date) return v;
    if (typeof v === "number") return new Date(v);
    if (typeof v === "string") {
        const s = v.trim();
        if (s.includes("T") || s.endsWith("Z")) return new Date(s);
        const maybeIso = s.replace(" ", "T");
        const d = new Date(maybeIso);
        if (!isNaN(d.getTime())) return d;
        const d2 = new Date(s);
        if (!isNaN(d2.getTime())) return d2;
        return null;
    }
    return null;
}

function determinarStatusComTempo(ppm, ultimaLeitura) {
    // se não tiver timestamp válido, volta ao comportamento normal
    const ultima = toDate(ultimaLeitura);
    const cincoMinMs = 5 * 60 * 1000;

    if (ultima && !isNaN(ultima.getTime())) {
        const diff = Date.now() - ultima.getTime();
        if (diff > cincoMinMs) {
            // última leitura com mais de 5 minutos: considerar ESTÁVEL
            return {
                status: 'Estável',
                cor: 'green',
                texto: 'text-green-600',
                bg: 'bg-green-500',
                borda: 'border-green-500'
            };
        }
    }

    // se chegou aqui, última leitura é recente (<=5min) ou inválida -> usa regra normal
    return determinarStatus(ppm);
}


// Função para formatar o tempo desde a última leitura (ainda não testado)!!!

function formatarTempoUltimaLeitura(timestamp) {
    if (timestamp === null || timestamp === undefined || timestamp === "") return "-";

    // tenta criar Date de forma tolerante
   

    const agora = new Date();
    const ultima = toDate(timestamp);
    if (!ultima || isNaN(ultima.getTime())) return "-"; // timestamp inválido

    const diffMs = agora.getTime() - ultima.getTime();

    // se timestamp no futuro (aceita 5s de tolerância)
    if (diffMs < -5000) {
        return "em breve";
    }

    const seg = Math.floor(diffMs / 1000);
    if (seg < 10) return "agora";
    if (seg < 60) return `há ${seg} ${seg === 1 ? "segundo" : "segundos"}`;

    const min = Math.floor(seg / 60);
    if (min < 60) return `há ${min} ${min === 1 ? "minuto" : "minutos"}`;

    const horas = Math.floor(min / 60);
    if (horas < 24) return `há ${horas} ${horas === 1 ? "hora" : "horas"}`;

    const dias = Math.floor(horas / 24);
    if (dias < 7) return `há ${dias} ${dias === 1 ? "dia" : "dias"}`;

    const semanas = Math.floor(dias / 7);
    if (semanas < 5) return `há ${semanas} ${semanas === 1 ? "semana" : "semanas"}`;

    // fallback: exibe data completa em pt-BR para diferenças muito grandes
    return `em ${ultima.toLocaleDateString("pt-BR")} ${ultima.toLocaleTimeString("pt-BR")}`;
}



function criarCardSensor(sensor) {
      // sensor.leituraPPM = valor (número ou null)
    // sensor.ultimaLeitura = timestamp (string, number ou Date)
    const status = determinarStatusComTempo(sensor.leituraPPM, sensor.ultimaLeitura);
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
                
                <p class="text-sm text-gray-500 mb-4">Sensor: ${sensor.codigo}</p>

                <div class="pt-2 border-t border-gray-100">
                    <p class="text-gray-700">Último alerta: 
                        <span class="font-bold ${status.texto}">${sensor.leituraPPM} PPM</span>
                    </p>
                    <p class="${(sensor.leituraPPM ?? 0) > 100 ? 'text-red-500 font-semibold' : 'text-gray-500'} text-sm">
                    Captado : ${tempoFormatado}
                    </p>
                </div>
            </div>
        </a>
    `;
}

// exemplos de dados de sensores, enquanto não ha banco

   async function carregarSensores() {
    try {
        credentials: "include"
        const resposta = await fetch("/api/sensores"); // já leva o cookie da sessão
        if (!resposta.ok) {
            throw new Error("Erro ao buscar sensores (talvez não logado)");
        }
         

        const sensores = await resposta.json();

        const grid = document.getElementById("sensores-grid");
          if (!grid) {
            // Página não tem grid de sensores — não faz nada
            return;
        }

        if (sensores.length === 0) {
            grid.innerHTML = `<p class="text-gray-500 text-lg">Nenhum sensor cadastrado ainda.</p>`;
            return;
        }

        grid.innerHTML = sensores.map(s => criarCardSensor({
            id: s.identificador,
            nome: s.nomeSala,
            codigo: s.identificador,
            leituraPPM: s.ultima_leitura,
            ultimaLeitura: s.data_hora // ainda não temos a data real
        })).join("");

    } catch (erro) {
        console.error("Erro ao carregar sensores:", erro);
    }
}

async function carregarHistorico() {
    const params = new URLSearchParams(window.location.search);

    // Ajuste: tente vários nomes comuns, para robustez
    const sensorId = params.get("local_id") || params.get("sensor") || params.get("id");

    if (!sensorId) {
        console.error("Nenhum sensor enviado na URL (esperado local_id, sensor ou id). URL:", window.location.search);
        return;
    }

    // Seletores por id (mais confiáveis)
    const tabelaBody = document.querySelector("#tbody");
    const tituloSala = document.querySelector("#titulo-sala");
    const valorAtualDiv = document.querySelector("#valor-atual");
    const valorDatahora = document.querySelector("#valor-datahora");

    if (!tabelaBody || !tituloSala || !valorAtualDiv || !valorDatahora) {
        console.error("Elementos da página não encontrados. Verifique ids #tbody, #titulo-sala,#valor-datahora e #valor-atual.");
        return;
    }

    try {
        // 1. Buscar histórico - ajuste do nome do query param dependendo do backend
        const resposta = await fetch(`/api/alertas?sensorId=${encodeURIComponent(sensorId)}`);

        if (!resposta.ok) {
            console.error("Erro na resposta da API:", resposta.status, await resposta.text());
            tabelaBody.innerHTML = `<tr><td colspan="3" class="py-4 text-red-500 text-center">Erro ao buscar histórico (${resposta.status})</td></tr>`;
            return;
        }

        const dados = await resposta.json();

        // Certifique-se que é array
        if (!Array.isArray(dados) || dados.length === 0) {
            tabelaBody.innerHTML = `<tr><td colspan="3" class="py-4 text-gray-500 text-center">Nenhum alerta registrado</td></tr>`;
            // também atualiza valor atual se desejar limpar
            valorAtualDiv.textContent = "-";
            return;
        }

        // 2. Atualizar título
        tituloSala.innerHTML = `Status do<br>Sensor ${sensorId ?? dados[0].sensor} - ${dados[0].sala ?? ""}`;

        // 3. Atualizar leitura atual (primeiro alerta da lista)
        // segurando que dados[0].valor exista
        valorAtualDiv.textContent = dados[0].valor ?? "-";
        valorDatahora.textContent = new Date(dados[0].data_hora).toLocaleString("pt-BR")  ?? "-";

        // 4. Preencher tabela
        tabelaBody.innerHTML = dados.map(alerta => `
            <tr class="text-gray-700 text-sm md:text-base">
                <td class="py-2 pr-4">${alerta.id ?? "-"}</td>
                <td class="py-2 px-4 ${alerta.nivel === 'vermelho' ? 'text-red-500' : alerta.nivel === 'amarelo'
            ? 'text-yellow-500': 'text-green-500'} font-medium">
                    ${alerta.nivel ?? "—"}
                </td>
                <td class="py-2 pr-4">${alerta.valor ?? "-"}</td>
                <td class="py-2 pl-4">
                    ${alerta.data_hora ? new Date(alerta.data_hora).toLocaleString("pt-BR") : "-"}
                </td>
            </tr>
        `).join("");

    } catch (err) {
        console.error("Erro ao carregar histórico:", err);
        tabelaBody.innerHTML = `<tr><td colspan="3" class="py-4 text-red-500 text-center">Erro ao carregar histórico</td></tr>`;
    }
}

// Chama a função quando o script for carregado
carregarHistorico();





document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("sensores-grid")) {
    carregarSensores();
    setInterval(carregarSensores, 30001);
  }
});
