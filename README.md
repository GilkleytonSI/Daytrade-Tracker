# Day Trade Tracker

O **Day Trade Tracker** é um sistema para registrar e gerenciar operações de day trade no mini índice. Ele permite calcular ganhos e perdas com base nos pontos, na quantidade de contratos, e nas taxas de operação. Além disso, exibe históricos mensais com saldos brutos e líquidos, destacando valores positivos ou negativos.

## Funcionalidades

- Registro de operações com:
  - Data
  - Pontos obtidos
  - Quantidade de contratos
  - Resultado financeiro
  - Taxas de operação
  - Resultado líquido

- **Histórico Mensal**:
  - Exibição de todas as operações por mês.
  - Somatório de saldos brutos e líquidos.
  - Botões mensais que mudam de cor (verde para positivo, vermelho para negativo).

- **Cálculos Automatizados**:
  - Resultado financeiro = Pontos x 0.20 x Quantidade de contratos.
  - Resultado líquido = Resultado financeiro - Taxas de operação.

## Tecnologias Utilizadas

### Frontend:
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5

### Backend:
- PHP 7+

### Banco de Dados:
- MySQL

## Configuração do Ambiente

### Requisitos:
- Servidor Web (Apache ou Nginx).
- PHP 7+ com extensão PDO habilitada.
- MySQL 5.7+.

### Passos para Configuração:
1. Clone o repositório em seu servidor.
2. Importe o seguinte SQL para configurar o banco de dados:

```sql
CREATE DATABASE daytrade;

USE daytrade;

CREATE TABLE trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    points INT NOT NULL,
    contracts INT NOT NULL DEFAULT 1,
    financial_result DECIMAL(10, 2) NOT NULL,
    operation_fee DECIMAL(10, 2) NOT NULL,
    net_result DECIMAL(10, 2) NOT NULL
);
```

3. Configure os scripts PHP (`save_trade.php` e `get_trades.php`) com as credenciais do banco de dados:

```php
$host = 'localhost';
$dbname = 'daytrade';
$user = 'root'; // Substitua pelo seu usuário do MySQL.
$password = ''; // Substitua pela sua senha do MySQL.
```

4. Acesse o sistema através do navegador, no endereço do servidor configurado.

## Como Usar

1. Acesse o formulário inicial para registrar uma nova operação.
2. Preencha os campos obrigatórios:
   - Data
   - Pontos
   - Quantidade de contratos
   - Taxa de operação

   Os valores de "Resultado Financeiro" e "Resultado Líquido" serão calculados automaticamente.

3. Clique em **Salvar** para registrar a operação.
4. Visualize o histórico mensal clicando nos botões dos meses.

## Estrutura de Arquivos

```
/
├── index.html           # Frontend principal
├── save_trade.php       # Endpoint para salvar operações
├── get_trades.php       # Endpoint para buscar histórico e resumo mensal
├── README.md            # Documentação do projeto
└── assets/              # Recursos adicionais (CSS, JS, etc.)
```

## Melhorias Futuras

- Exportação de relatórios em PDF/Excel.
- Gráficos para análise de desempenho.
- Autenticação de usuário para operações multiusuário.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

