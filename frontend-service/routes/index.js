







const express = require('express');
const router = express.Router(); //what does Router constructer acutally do?
const producerService  = require('../services/producerService');
const consumerService = require('../services/consumerService');

router.get('/', (req,res)=>{
    console.log("you reached the index endpoint!! :D ");
    res.render('home_page', {message:"hello"});
});

router.post('/add', async (req,res)=>{
    const result = await producerService.addItem(req.body.item);
    res.render('result', {message: result});
});

router.post('/remove', async (req,res)=>{
    const result = await consumerService.addItem(req.body.item);
    res.render('result', {message: result});
});


router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Call auth microservice
  try {
    const response = await axios.post('http://auth-service/login', { username, password });
    req.session.user = response.data.user;
    res.redirect('/');
  } catch (err) {
    res.render('login', { error: 'Invalid credentials' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});



router.get('/products', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const response = await axios.get('http://product-service/products');
    res.render('products', { products: response.data });
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});




// index.js
//require('../services/eureka'); // Start Eureka client
const { callService , postService} = require('../services/serviceCaller');

router.get('/hello', async (req, res) => {
  try {
    const message = await callService('PRODUCER_RESOURCE', '/api/hello');
    res.send(message);
  } catch (err) {
    res.status(500).send('Failed to reach producer');
  }
});

router.post('/producer_resource_frontend', async (req, res) => {
  try {
    const message = await postService('PRODUCER_RESOURCE', '/api/supplies', req);
    res.send(message);
  } catch (err) {
    res.status(500).send('Failed to reach producer');
  }
});


module.exports = router;