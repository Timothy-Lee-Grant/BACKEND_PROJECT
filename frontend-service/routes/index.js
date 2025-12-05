







const express = require('express');
const router = express.Router();
const producerService  = require('../services/producerService');
const consumerService = require('../services/consumerService');
const pool = require('../services/postgresql')
const bcrypt = require('bcrypt');
const { callService, postService } = require('../services/serviceCaller');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new account
 *               password:
 *                 type: string
 *                 description: Password for the new account
 *     responses:
 *       302:
 *         description: User registered successfully and redirected to home
 *       500:
 *         description: Internal server error during registration
 *   get:
 *     summary: Get registration page
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns the registration form page
 */
router.post('/register', async (req, res)=>{
  const {username, password} = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, hash]);
  //res.send('User registered');
  req.body.isLoggedIn = true;
  res.redirect('/');
});

router.get('/register',(req, res)=>{
  res.render('create_account');
})

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get the home page
 *     tags:
 *       - Home
 *     description: Returns the home page if user is logged in
 *     responses:
 *       200:
 *         description: Home page rendered successfully
 *       400:
 *         description: User not logged in
 */

router.get('/', (req,res)=>{
    if(req.session.isLoggedIn)
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
});

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Get the login page
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns the login form page
 *   post:
 *     summary: Authenticate user and create session
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Login successful, redirects to home page
 *       401:
 *         description: Invalid username or incorrect password
 *       500:
 *         description: Internal server error during login
 */

router.post('/login', async (req,res)=>{
  try{
    const {username, password} = req.body;
    //const hash = await bcrypt.hash(password, 10); //For the same raw password does it give the same has each time?
    const result = await pool.query('SELECT password_hash FROM users WHERE username = $1', [username]);
    if(result.rows.length === 0){
      return res.status(401).send('Invalid username or password');
    }

    const storedHash = result.rows[0].password_hash;

    const isMatch = await bcrypt.compare(password, storedHash);

    if (isMatch){
      req.session.isLoggedIn = true;
      res.redirect('/');
    } else{
      res.status(401).send('Incorrect username or password')
    }
  }
  catch(err) {
    res.status(500).send(`Error in login route ${err}`);
  }
});


router.post('/add', async (req,res)=>{
    const result = await producerService.addItem(req.body.item);
    res.render('result', {message: result});
});

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add a new item via producer service
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item
 *             properties:
 *               item:
 *                 type: string
 *                 description: Item name or identifier to add
 *     responses:
 *       200:
 *         description: Item added successfully
 *       500:
 *         description: Error adding item to producer service
 */

router.post('/remove', async (req,res)=>{
    const result = await consumerService.addItem(req.body.item);
    res.render('result', {message: result});
});

/**
 * @swagger
 * /remove:
 *   post:
 *     summary: Remove an item via consumer service
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item
 *             properties:
 *               item:
 *                 type: string
 *                 description: Item name or identifier to remove
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       500:
 *         description: Error removing item from consumer service
 */


router.post('/login_no_authentication', (req, res)=>{
  req.session.user = {password: req.body.password, username: req.body.username};
  //res.send('Success');
  //console.log("alskfaoin");
  //res.redirect('/');
  //res.render('home_page', {message:"hello"});
  res.send("your data is "+req.session.user.password);
});

/**
 * @swagger
 * /login_no_authentication:
 *   post:
 *     summary: Login without authentication (for testing only)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session created without authentication verification
 *       500:
 *         description: Error creating session
 */

/*
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
*/

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user and destroy session
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Session destroyed, redirects to home page
 *       500:
 *         description: Error during logout
 */



router.get('/products', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const response = await axios.get('http://product-service/products');
    res.render('products', { products: response.data });
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     description: Fetches products from product service (requires authentication)
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       302:
 *         description: Not authenticated, redirects to login
 *       500:
 *         description: Error fetching products from service
 */







// index.js
//require('../services/eureka'); // Start Eureka client

router.get('/hello', async (req, res) => {
  try {
    const message = await callService('PRODUCER_RESOURCE', '/api/hello');
    res.send(message);
  } catch (err) {
    res.status(500).send('Failed to reach producer');
  }
});

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Test endpoint to reach producer service
 *     tags:
 *       - Service Communication
 *     description: Calls the producer service hello endpoint to verify connectivity
 *     responses:
 *       200:
 *         description: Message from producer service
 *       500:
 *         description: Failed to reach producer service
 */

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

/**
 * @swagger
 * /producer_resource_frontend:
 *   post:
 *     summary: Forward request to producer service
 *     tags:
 *       - Service Communication
 *     description: Sends data to the producer service to add supplies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully processed by producer service
 *       500:
 *         description: Failed to reach producer service
 */

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

/**
 * @swagger
 * /consumer_resource_frontend:
 *   post:
 *     summary: Forward request to consumer service
 *     tags:
 *       - Service Communication
 *     description: Sends data to the consumer service to consume resources
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully processed by consumer service
 *       500:
 *         description: Failed to reach consumer service
 */




module.exports = router;