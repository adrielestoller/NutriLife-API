import express from "express";
import router from "./routers/router";

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./../swaggerConfig');

const app = express();

app.use(express.json());
app.use("/api", router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
