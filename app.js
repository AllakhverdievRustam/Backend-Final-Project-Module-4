const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swaggerDocument.json');

const app = express();

app.use(express.json());
app.use(fileUpload({}));
app.use(express.static(__dirname + "/source/images"));
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const apiRoutes = require("./src/modules/routes/routes");

app.use("/", apiRoutes);

const url = "mongodb+srv://Rustam:1234qwer@clusterhospital.e8ks0.mongodb.net/Hospital?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(8000, () => {
  console.log('Example app on port 8000!');
});