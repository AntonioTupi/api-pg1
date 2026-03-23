// ============================================================
// APP.JS - Arquivo Principal da Aplicação (PostgreSQL)
// ============================================================

// Importar o Express
const express = require('express');
const app = express();
const PORT = 3000;

// ============================================================
// MIDDLEWARES
// ============================================================

// Middleware para processar JSON no body das requisições
app.use(express.json());

// ============================================================
// IMPORTAR ROTAS
// ============================================================

// Importar as rotas de produtos
const produtoRoutes = require('./src/routes/produtoRoutes');

// ============================================================
// REGISTRAR ROTAS
// ============================================================

// Todas as rotas de produtos ficarão disponíveis em /produtos
app.use('/produtos', produtoRoutes);

// ============================================================
// ROTA RAIZ (Boas-vindas)
// ============================================================

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Produtos com PostgreSQL - Bem-vindo!',
        versao: '3.0',
        banco: 'PostgreSQL',
        arquitetura: 'MVC',
        rotas_disponiveis: {
            listar_todos: 'GET /produtos',
            buscar_por_id: 'GET /produtos/:id',
            buscar_por_categoria: 'GET /produtos/categoria/:categoria',
            criar: 'POST /produtos',
            atualizar: 'PUT /produtos/:id',
            deletar: 'DELETE /produtos/:id'
        }
    });
});

// ============================================================
// INICIAR O SERVIDOR
// ============================================================

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Servidor rodando!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`💾 Banco de Dados: PostgreSQL`);
    console.log(`🏗️  Arquitetura: MVC (Model-View-Controller)`);
    console.log('='.repeat(50));
    console.log('📋 Rotas disponíveis:');
    console.log(`   GET    http://localhost:${PORT}/produtos`);
    console.log(`   GET    http://localhost:${PORT}/produtos/:id`);
    console.log(`   GET    http://localhost:${PORT}/produtos/categoria/:nome`);
    console.log(`   POST   http://localhost:${PORT}/produtos`);
    console.log(`   PUT    http://localhost:${PORT}/produtos/:id`);
    console.log(`   DELETE http://localhost:${PORT}/produtos/:id`);
    console.log('='.repeat(50));
});
