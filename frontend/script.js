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
