const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'NutriLife API',
            version: '1.0.0',
            description: 'API para gerenciamento de refeições, postagens, perfis e preferências alimentares na aplicação NutriLife',
        },
        servers: [{
            url: 'http://localhost:3000/api',
        }],
    },
    apis: ['./src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
