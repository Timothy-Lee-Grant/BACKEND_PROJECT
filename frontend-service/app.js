









const express = require('express');
const path = require('path'); 
const indexRouter = require('./routes/index');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true})); //what does this do?
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret', 
    resave: false,
    saveUninitialized: true
}));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000; // we get the port but how does the process.env acutally work? does it communicate with my OS 
app.listen(PORT, ()=>console.log(`Frontend service is now running on ${PORT}`));