
const express = require('express');
const path = require('path'); 
const indexRouter = require('./routes/index');
const session = require('express-session');
require('./services/eureka');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true})); //what does this do?
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


//attempting to get swagger to work
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Adjust path to where your routes live
};

const specs = swaggerJsdoc(options);


app.use(session({
    secret: 'your-secret', 
    resave: false,
    saveUninitialized: false
}));

app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//app.use('/testing, testingRouter');

const PORT = process.env.PORT || 3000; // we get the port but how does the process.env acutally work? does it communicate with my OS 
app.listen(PORT, ()=>console.log(`Frontend service is now running on ${PORT}`));