# Mini-Projeto Avaliativo — E-commerce com TypeScript

**Aluno:** Luis Cesar Serafim Junior  
**Turma:** 5 – NODE  
**Curso:** Desenvolvedor Back-End Node [T5]  
**Módulo:** 1 — Semana 07  
**Tecnologias:** TypeScript e Node.js

## 1. Objetivo

Construir uma aplicação de terminal (sem interface HTML, API, banco de dados ou pagamento) capaz de cadastrar e consultar produtos e clientes, manter um carrinho de compras, registrar pedidos, calcular totais, atualizar estoque e produzir relatórios simples.

## 2. Preparação e execução

**Pré-requisito:** Node.js 20 ou mais recente com npm.

Abra o terminal na pasta raiz deste projeto e execute:

```bash
npm install
npm run build
npm start
```

Ou utilize `npm run dev` para compilar e executar de uma só vez. Para executar os testes:

```bash
npm test
```

- `npm install`: instala o compilador TypeScript (`typescript`).
- `npm run build`: transforma os arquivos `src/*.ts` em JavaScript na pasta `dist/`.
- `npm start`: executa `dist/main.js` com o Node.js.
- `npm test`: compila o projeto e executa os testes automatizados.

## 3. Estrutura do projeto

```text
Miniprojeto_Ecommerce_LuisCesarSerafimJunior_Turma5_NODE/
├── src/
│   ├── types.ts           # Tipagem das entidades
│   ├── dados.ts           # Estado inicial: produtos, 3 clientes, carrinho e pedidos
│   ├── utils.ts           # Regras comuns de validação e cálculo com centavos
│   ├── produtos.ts        # Cadastro, listagem, busca, filtro, edição e exclusão
│   ├── clientes.ts        # Cadastro e consultas de clientes
│   ├── carrinho.ts        # Inclusão, remoção, alteração, subtotais e total
│   ├── pedidos.ts         # Finalização, estoque, histórico e busca por cliente
│   ├── relatorios.ts      # Resumo de vendas e relatório de estoque
│   └── main.ts            # Demonstração das funcionalidades e dos erros
├── tests/
│   └── ecommerce.test.cjs # Testes independentes das regras de negócio
├── README.md              # Este documento
├── GUIA_DE_ESTUDO.md      # Aula detalhada e explicação das linhas de código
├── package.json           # Metadados e comandos npm
├── tsconfig.json          # Configuração do TypeScript
└── .gitignore             # Arquivos não versionados
```

A pasta `dist/` é criada automaticamente pela compilação. Não precisa ser enviada ao GitHub, porque pode ser reconstruída com `npm install && npm run build`.

## 4. Funcionalidades implementadas

| Requisito | Implementação |
|---|---|
| Cadastrar, listar e buscar produtos por ID | `produtos.ts` |
| Buscar parte do nome e filtrar por categoria | `produtos.ts` |
| Atualizar e remover produtos | `produtos.ts` |
| Validar ID único, nome, preço e estoque | `produtos.ts` e `utils.ts` |
| Cadastrar, listar e consultar clientes | `clientes.ts` |
| Impedir ID ou e-mail duplicado e exigir dados | `clientes.ts` |
| Iniciar com pelo menos três clientes | `dados.ts` |
| Adicionar, remover e alterar itens no carrinho | `carrinho.ts` |
| Validar quantidade e disponibilidade em estoque | `carrinho.ts` |
| Calcular subtotais e total | `carrinho.ts` e `utils.ts` |
| Finalizar pedidos com cliente e itens | `pedidos.ts` |
| Registrar ID, data, total e preços praticados | `pedidos.ts` |
| Reduzir estoque só após validação completa | `pedidos.ts` |
| Listar pedidos e consultar por cliente | `pedidos.ts` |
| Relatórios de faturamento e estoque | `relatorios.ts` |
| Demonstrar fluxo real e pelo menos três situações inválidas | `main.ts` |
| Código tipado, modular, compilável e funções com parâmetros/retorno | Todos os arquivos `.ts` |

## 5. Regras de negócio importantes

1. **Produto:** ID positivo, único; nome e categoria não vazios; preço maior que zero, com até duas casas decimais; estoque inteiro e não negativo.
2. **Cliente:** ID positivo e único; nome obrigatório; e-mail obrigatório, com formato básico válido e único, sem diferenciar letras maiúsculas de minúsculas.
3. **Carrinho:** cada produto aparece uma única vez. Adicionar novamente aumenta a quantidade já existente. Não é permitido quantidade zero, negativa, fracionada ou acima do estoque disponível.
4. **Pedido:** é necessário um cliente existente e um carrinho não vazio. Antes da compra, o sistema verifica todos os itens e o estoque. Só depois altera os saldos e registra o pedido.
5. **Preço histórico:** cada item do pedido salva o nome e o preço da compra. Alterar o catálogo não altera pedidos anteriores.
6. **Cálculos monetários:** internamente as operações são feitas em centavos inteiros para reduzir erros típicos de números decimais em JavaScript.
7. **Exclusão:** não é permitido excluir produto presente no carrinho atual; produtos que constam de pedidos antigos podem ser removidos porque o histórico mantém os dados comprados.

## 6. Exemplo de execução

A demonstração de `main.ts`:

1. Lista quatro produtos e cadastra, busca, atualiza e remove outro.
2. Lista três clientes e cadastra um quarto cliente.
3. Adiciona itens ao carrinho, acumula produtos repetidos, altera quantidades e remove um item.
4. Fecha um pedido com 1 notebook (R$ 2.500,00) + 3 mouses (R$ 50,00 cada): **R$ 2.650,00**.
5. Atualiza o estoque (notebook de 5 para 4 e mouse de 10 para 7).
6. Exibe pedidos, relatório de estoque e resumo de vendas.
7. Demonstra quatro erros tratados: preço negativo, quantidade acima do estoque, carrinho vazio e e-mail de cliente duplicado.

### Saída esperada do resumo

```text
quantidadePedidos: 1
produtosCadastrados: 4
quantidadeEmEstoque: 23
unidadesVendidas: 4
faturamento: 2650
```

## 7. Roteiro de sprints, conforme o enunciado

| Sprint | Entrega | Arquivos |
|---|---|---|
| 1 — Configuração | Criar repositório, estrutura, tipagem e dados iniciais | `package.json`, `tsconfig.json`, `types.ts`, `dados.ts` |
| 2 — Produtos | Cadastro, buscas, filtros, atualização e remoção | `produtos.ts`, `utils.ts` |
| 3 — Clientes e carrinho | Cadastro de clientes, inserção, remoção e cálculo | `clientes.ts`, `carrinho.ts` |
| 4 — Pedidos | Finalização, estoque e histórico de preços | `pedidos.ts` |
| 5 — Integração e testes | Fluxo completo e testes de casos inválidos | `main.ts`, `relatorios.ts`, `tests/` |
| 6 — Documentação e entrega | README, conferência e commits | `README.md`, `GUIA_DE_ESTUDO.md` |

## 8. Limitações conhecidas e melhorias futuras

- O sistema usa **memória RAM**. Os dados são reiniciados quando o programa é executado novamente. O enunciado dispensa banco de dados.
- Há **um carrinho de compras por execução**, associado ao cliente quando a compra é finalizada. Em uma aplicação real com vários clientes simultâneos, cada carrinho teria um identificador próprio e isolamento por usuário.
- Não há interface web, pagamento, autenticação nem API REST: esses recursos são opcionais e não fazem parte do escopo mínimo.
- A validação de e-mail verifica apenas um formato básico; ela não comprova a existência da caixa postal.
- Para uma aplicação de produção, seriam necessários persistência transacional, concorrência segura, controle de acesso, logs estruturados, tratamento de dados pessoais e testes de integração.

## 9. Checklist de entrega

- [ ] Subir código-fonte, testes, README e arquivos de configuração para repositório **público** no GitHub.
- [ ] Incluir nome completo e identificação **Turma 5 – NODE** no README.
- [ ] Fazer commits com mensagens claras registrando o desenvolvimento.
- [ ] Conferir `npm run build`, `npm start` e `npm test` antes do envio.
- [ ] Enviar o link do GitHub à AVA/GitHgit remote add originub conforme o procedimento exigido pela escola.

