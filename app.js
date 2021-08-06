const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const apiRoutes = require("./src/modules/routes/routes");

app.use("/", apiRoutes);

const url = "mongodb+srv://Rustam:1234qwer@clusterhospital.e8ks0.mongodb.net/Hospital?retryWrites=true&w=majority";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(8000, () => {
  console.log('Example app on port 8000!');
});