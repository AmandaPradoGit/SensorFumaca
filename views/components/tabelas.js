async function carregarAlertas() {
  try {
    // Faz uma requisição GET para o backend
    const resposta = await fetch("http://localhost:3000/alertas");
    const dados = await resposta.json();

    const tbody = document.querySelector("#tabela tbody");
    tbody.innerHTML = "";

    // Preenche a tabela com os dados
    dados.forEach(alerta => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${alerta.id}</td>
        <td>${new Date(alerta.data_hora).toLocaleString("pt-BR")}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar alertas:", err);
  }
}

// Atualizar ao abrir a página
carregarAlertas();

// Botão para atualizar manualmente
document.getElementById("atualizar").addEventListener("click", carregarAlertas);

// Função para carregar dados do sensor na visualização
export async function carregarSensor(id) {
  try {
    const resposta = await fetch(`/api/sensores/${id}`);
    if (!resposta.ok) throw new Error("Erro ao carregar sensor.");
    const sensor = await resposta.json();
    document.getElementById("nome-sala").innerText = sensor.nomeSala;
    document.getElementById("ppm-atual").innerText = sensor.leituraPPM || "---";
    document.getElementById("status-indicador").innerText = sensor.status || "Desconhecido";
  } catch (erro) {
    document.getElementById("nome-sala").innerText = "ERRO";
    document.getElementById("ppm-atual").innerText = "---";
    document.getElementById("status-indicador").innerText = "Falha";
  }
}

// Função para carregar alertas do sensor na visualização
export async function carregarAlertas(sensorId) {
  try {
    const resposta = await fetch(`/api/alertas?sensor_id=${sensorId}`);
    if (!resposta.ok) throw new Error("Erro ao carregar alertas.");
    const alertas = await resposta.json();
    const tabela = document.getElementById("tabela-alertas");
    tabela.innerHTML = alertas.map(alerta => `
      <tr>
        <td>${alerta.id}</td>
        <td>${alerta.nivel}</td>
        <td>${alerta.data_hora}</td>
      </tr>
    `).join('');
  } catch (erro) {
    document.getElementById("tabela-alertas").innerHTML = 
      '<tr><td colspan="3">Erro ao carregar alertas.</td></tr>';
  }
}
