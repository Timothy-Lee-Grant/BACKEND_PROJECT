







const express = require('express');
const router = express.Router(); //what does Router constructer acutally do?
const producerService  = require('../services/producerService');
const consumerService = require('../services/consumerService');

router.get('/', (req,res)=>{
    if(req.session.user)
    {
      console.log("you reached the index endpoint!! :D ");
      res.render('home_page', {message:"hello"});
    }
    else{
      //res.render('home_page', {message:"hello"});
      res.status(400).send({error: 'Not Logged In!!!!'});
    }
    
});

router.get('/login', (req, res)=>{
  res.render('login_page', {});
})


router.post('/add', async (req,res)=>{
    const result = await producerService.addItem(req.body.item);
    res.render('result', {message: result});
});

router.post('/remove', async (req,res)=>{
    const result = await consumerService.addItem(req.body.item);
    res.render('result', {message: result});
});


router.post('/login_no_authentication', (req, res)=>{
  req.session.user = {id: 555, username:'Timothy'};
  //res.send('Success');
  //console.log("alskfaoin");
  //res.redirect('/');
  res.render('home_page', {message:"hello"});
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
    res.json({ success: true, message: message });
  } catch (err) {
    console.error('Producer service error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.response?.data || err.message || 'Failed to reach producer service' 
    });
  }
});

router.post('/consumer_resource_frontend', async (req,res)=>{
  try{
    const message = await postService('CONSUMER_RESOURCE', '/consume_resource', req);
    res.json({ success: true, message: message });
  }catch(error){
    console.error('Consumer service error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data || error.message || 'Failed to reach consumer service' 
    });
  }
});




module.exports = router;