const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Função para calcular valores com base nos pontos e taxas
document.getElementById('points').addEventListener('input', function () {
    const points = parseFloat(this.value) || 0;
    const pointValue = 0.2; // Valor por ponto
    const financialResult = points * pointValue;

    document.getElementById('financialResult').value = financialResult.toFixed(2);
    calculateNetResult();
});

document.getElementById('operationFee').addEventListener('input', calculateNetResult);

function calculateNetResult() {
    const financialResult = parseFloat(document.getElementById('financialResult').value) || 0;
    const operationFee = parseFloat(document.getElementById('operationFee').value) || 0;
    const netResult = financialResult - operationFee;

    document.getElementById('netResult').value = netResult.toFixed(2);
}

document.getElementById('points').addEventListener('input', calculateFinancialResult);
document.getElementById('contracts').addEventListener('input', calculateFinancialResult);

function calculateFinancialResult() {
    const points = parseFloat(document.getElementById('points').value) || 0;
    const contracts = parseInt(document.getElementById('contracts').value) || 1;
    const pointValue = 0.20; // Valor por ponto

    const financialResult = points * pointValue * contracts;
    document.getElementById('financialResult').value = financialResult.toFixed(2);

    calculateNetResult();
}


async function fetchMonthSummary() {
    try {
        const response = await fetch('get_trades.php?action=summary');
        const result = await response.json();

        if (result.success) {
            const monthButtons = document.getElementById('monthButtons');
            monthButtons.innerHTML = '';

            const currentYear = new Date().getFullYear();
            result.data.forEach(month => {
                const netResult = parseFloat(month.net_result);
                const financialResult = parseFloat(month.financial_result);
                const buttonColor = netResult >= 0 ? 'btn-success' : 'btn-danger';
                const buttonText = `
                    ${monthNames[month.month - 1]} ${currentYear}: 
                    <br> Bruto: R$ ${financialResult.toFixed(2)} 
                    <br> Líquido: R$ ${netResult.toFixed(2)}
                `;

                const button = document.createElement('button');
                button.className = `btn ${buttonColor} w-100 mb-3`;
                button.setAttribute('data-month', month.month);
                button.innerHTML = buttonText;

                button.addEventListener('click', () => showMonthHistory(month.month));

                const col = document.createElement('div');
                col.className = 'col-3';
                col.appendChild(button);

                monthButtons.appendChild(col);
            });
        } else {
            alert('Erro ao carregar o resumo dos meses.');
        }
    } catch (error) {
        console.error('Erro ao buscar resumo dos meses:', error);
    }
}

async function showMonthHistory(month) {
    const modalMonthName = document.getElementById('modalMonthName');
    modalMonthName.textContent = monthNames[month - 1];

    const modalHistoryTable = document.getElementById('modalHistoryTable');
    modalHistoryTable.innerHTML = '<tr><td colspan="5" class="text-center">Carregando...</td></tr>';

    try {
        const response = await fetch(`get_trades.php?month=${month}`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            modalHistoryTable.innerHTML = '';

            result.data.forEach(trade => {
                const row = `
                    <tr data-id="${trade.id}">
                        <td>${new Date(trade.date).toLocaleDateString('pt-BR')}</td>
                        <td>${trade.contracts}</td>
                        <td>${trade.points}</td>
                        <td>R$ ${parseFloat(trade.financial_result).toFixed(2)}</td>
                        <td>R$ ${parseFloat(trade.operation_fee).toFixed(2)}</td>
                        <td>R$ ${parseFloat(trade.net_result).toFixed(2)}</td>   
                        <td>
                            <button class="btn btn-warning btn-sm me-2" onclick="editTrade(${trade.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteTrade(${trade.id})">Excluir</button>
                        </td>
                    </tr>
                `;
                modalHistoryTable.insertAdjacentHTML('beforeend', row);
            });
        } else {
            modalHistoryTable.innerHTML = '<tr><td colspan="5" class="text-center">Sem registros para este mês.</td></tr>';
        }
    } catch (error) {
        modalHistoryTable.innerHTML = '<tr><td colspan="5" class="text-center">Erro ao carregar os dados.</td></tr>';
        console.error('Erro:', error);
    }

    const modal = new bootstrap.Modal(document.getElementById('historyModal'));
    modal.show();
}

// Função para Editar um Registro
function editTrade(id) {
    fetch(`get_trades.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const trade = data.data;
                document.getElementById('editId').value = trade.id;
                document.getElementById('editDate').value = trade.date;
                document.getElementById('editPoints').value = trade.points;
                document.getElementById('editContracts').value = trade.contracts;
                document.getElementById('editOperationFee').value = trade.operation_fee;

                const modal = new bootstrap.Modal(document.getElementById('editModal'));
                modal.show();
            } else {
                alert('Erro ao buscar registro: ' + data.message);
            }
        })
        .catch(error => console.error('Erro:', error));
}

document.getElementById('editForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const date = document.getElementById('editDate').value;
    const points = document.getElementById('editPoints').value;
    const contracts = document.getElementById('editContracts').value;
    const operationFee = document.getElementById('editOperationFee').value;

    fetch('edit_trade.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, date, points, contracts, operationFee })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Atualizar a linha correspondente no DOM
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    const financialResult = (points * 0.20 * contracts).toFixed(2);
                    const netResult = (financialResult - operationFee).toFixed(2);

                    row.innerHTML = `
                        <td>${new Date(date).toLocaleDateString('pt-BR')}</td>
                        <td>${contracts}</td>
                        <td>${points}</td>
                        <td>R$ ${financialResult}</td>
                        <td>R$ ${operationFee}</td>
                        <td>R$ ${netResult}</td>
                        <td>
                            <button class="btn btn-warning btn-sm me-2" onclick="editTrade(${id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteTrade(${id})">Excluir</button>
                        </td>
                    `;
                }

                alert('Registro atualizado com sucesso!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                modal.hide();
                fetchMonthSummary();
            } else {
                alert('Erro ao atualizar registro: ' + data.message);
            }
        })
        .catch(error => console.error('Erro:', error));
});


// Função para Excluir um Registro
function deleteTrade(id) {
    if (confirm('Tem certeza de que deseja excluir este registro?')) {
        fetch(`delete_trade.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remover a linha correspondente do DOM
                    const row = document.querySelector(`tr[data-id="${id}"]`);
                    if (row) {
                        row.remove();
                        fetchMonthSummary();
                    }
                    alert('Registro excluído com sucesso!');
                } else {
                    alert('Erro ao excluir registro: ' + data.message);
                }
            })
            .catch(error => console.error('Erro:', error));
    }
}


document.getElementById('tradeForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const tradeDate = document.getElementById('tradeDate').value;
    const contracts = document.getElementById('contracts').value;
    const points = document.getElementById('points').value;
    const financialResult = document.getElementById('financialResult').value;
    const operationFee = document.getElementById('operationFee').value;
    const netResult = document.getElementById('netResult').value;

    try {
        const response = await fetch('save_trade.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tradeDate, contracts, points, financialResult, operationFee, netResult })
        });

        const result = await response.json();

        if (result.success) {
            alert('Registro salvo com sucesso!');
            document.getElementById('tradeForm').reset();
            fetchMonthSummary();

        } else {
            alert('Erro ao salvar registro: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao conectar ao servidor.');
        console.error(error);
    }
});

document.querySelectorAll('.month-box').forEach(box => {
    box.addEventListener('click', async function () {
        const month = parseInt(this.getAttribute('data-month'));
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const monthName = monthNames[month - 1];

        document.getElementById('modalMonthName').textContent = monthName;

        const modalHistoryTable = document.getElementById('modalHistoryTable');
        modalHistoryTable.innerHTML = '<tr><td colspan="5" class="text-center">Carregando...</td></tr>';

        try {
            const response = await fetch(`get_trades.php?month=${month}`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                modalHistoryTable.innerHTML = '';

                result.data.forEach(trade => {
                    const row = `
                        <tr>
                            <td>${new Date(trade.date).toLocaleDateString('pt-BR')}</td>
                            <td>${trade.points}</td>
                            <td>${trade.contracts}</td>
                            <td>R$ ${parseFloat(trade.financial_result).toFixed(2)}</td>
                            <td>R$ ${parseFloat(trade.operation_fee).toFixed(2)}</td>
                            <td>R$ ${parseFloat(trade.net_result).toFixed(2)}</td>
                        </tr>
                    `;
                    modalHistoryTable.insertAdjacentHTML('beforeend', row);
                });

            } else {
                modalHistoryTable.innerHTML = '<tr><td colspan="5" class="text-center">Sem registros para este mês.</td></tr>';
            }
        } catch (error) {
            modalHistoryTable.innerHTML = '<tr><td colspan="5" class="text-center">Erro ao carregar os dados.</td></tr>';
            console.error('Erro:', error);
        }

        const modal = new bootstrap.Modal(document.getElementById('historyModal'));
        modal.show();
    });
});

document.getElementById('darfForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const darfValue = document.getElementById('darfValue').value;
    const darfStatus = document.getElementById('darfStatus').value;
    const darfMonth = document.getElementById('darfMonth').value;

    if (!darfValue || !darfStatus || !darfMonth) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch('save_darf.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parseFloat(darfValue), status: darfStatus, month: parseInt(darfMonth) })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                document.getElementById('darfForm').reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('darfModal'));
                modal.hide();
            } else {
                alert('Erro ao salvar DARF: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao salvar DARF:', error);
            alert('Erro ao salvar DARF. Tente novamente.');
        });
});

document.querySelector('[data-bs-target="#darfTableModal"]').addEventListener('click', function() {
    const tableBody = document.getElementById('darfTableBody');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando...</td></tr>';

    fetch('get_darf.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.length > 0) {
                tableBody.innerHTML = '';
                data.data.forEach(record => {
                    const row = `
                        <tr>
                            <td>R$ ${parseFloat(record.value).toFixed(2)}</td>
                            <td>${record.status === 'pago' ? 'Pago' : 'Pendente'}</td>
                            <td>${['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][record.month - 1]}</td>
                            <td>${record.year}</td>
                            <td>${new Date(record.created_at).toLocaleDateString('pt-BR')} ${new Date(record.created_at).toLocaleTimeString('pt-BR')}</td>
                        </tr>
                    `;
                    tableBody.insertAdjacentHTML('beforeend', row);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum registro encontrado.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar registros de DARF:', error);
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao carregar os registros.</td></tr>';
        });
});



// Inicializa os botões com resumo do mês ao carregar a página
fetchMonthSummary();