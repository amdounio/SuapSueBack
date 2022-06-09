
const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config()
const env = process.env.NODE_ENV 

HOSTS_ALLOWED_ORIGIN = ['http://localhost:4200']
const  PORT  =  3127;
const {user} = require('./src/database/relations')
const app = express()

require('./src/database/db');

//Déclaration des routes
const userRoute = require('./src/routes/userRoute')
const roleRoute = require("./src/routes/roleRoute")
const municipalityRoute = require("./src/routes/MunicipalityRoute")
const surveySectionRoute = require("./src/routes/surveySectionRoute");
const questionRoute = require("./src/routes/questionRoute")
const questionOptionRoute = require('./src/routes/questionOptionRoute')

const inputTypeRoute = require('./src/routes/inputTypeRoute')
const productRoute = require('./src/routes/productRoute')
const commentRoute = require('./src/routes/commentRoute')
const reviewsRoute = require('./src/routes/reviewsRoute')
const optionGroupRoute = require('./src/routes/OptionGroupRoute')
const trackTypeRoute = require('./src/routes/trackTypeRoute')

// midlewares
app.use("/images", express.static(__dirname + '/' + 'images'));
app.use("/products", express.static(__dirname + '/' + 'products'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

//Définition des routes

app.use('/user',userRoute);
app.use('/role',roleRoute);
app.use('/municipality',municipalityRoute);
app.use('/surveysection',surveySectionRoute)
app.use('/question',questionRoute);
app.use('/optiongroup',optionGroupRoute);
app.use('/input_type',inputTypeRoute);

app.use('/question_option',questionOptionRoute);
app.use('/comment',commentRoute);
app.use('/reviews',reviewsRoute);
app.use('/trackTypes',trackTypeRoute);

app.listen(PORT, () => {
    console.log('Server started at port : '+PORT)
})