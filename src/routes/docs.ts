import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const docsRouter = express.Router();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ImNaYeongSeokToo-Server',
      version: '1.0.0',
      description: 'REST API with Express',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/',
      },
    },
    servers: [
      { url: 'http://localhost:4000', description: '개발 서버' },
    ],
  },
  apis: ['./src/swagger/routes/*', './src/swagger/components/*'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
docsRouter.use('/', swaggerUi.serve);
docsRouter.get('/', swaggerUi.setup(swaggerSpec, { explorer: true }));

export default docsRouter;
