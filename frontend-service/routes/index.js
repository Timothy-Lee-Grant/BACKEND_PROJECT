







const express = require('express');
const router = express.Router(); //what does Router constructer acutally do?
const producerService  = require('../services/producerService');
const consumerService = require('../services/consumerService');

router.get('/', (req,res)=>{
    console.log("you reached the index endpoint!! :D ");
    res.send('index');
});

router.post('/add', async (req,res)=>{
    const result = await producerService.addItem(req.body.item);
    res.render('result', {message: result});
});

router.post('/remove', async (req,res)=>{
    const result = await consumerService.addItem(req.body.item);
    res.render('result', {message: result});
});

module.exports = router;