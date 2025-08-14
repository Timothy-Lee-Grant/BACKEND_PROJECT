







const express = require('express');
const router = express.Router();
const axios = require('axios');
const eurekaClient = require('../eurekaClient.js');

const getServiceUrl = (serviceName)=>{
    const instances = eurekaClient.getInstanceByAppId(serviceName.toUpperCase());
    if(instances.length > 0 ){
        const instance = instances[0];
        return `http://${instance.ipAddr}:${instance.port.$}`;
    }
    return null;
};

router.post('/add', async (req, res) => {
  const producerUrl = getServiceUrl('producer-service');
  if (!producerUrl) return res.status(500).send('Producer service unavailable');

  try {
    const response = await axios.post(`${producerUrl}/add`, req.body);
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Error adding item');
  }
});

router.post('/remove', async (req, res) => {
  const consumerUrl = getServiceUrl('consumer-service');
  if (!consumerUrl) return res.status(500).send('Consumer service unavailable');

  try {
    const response = await axios.post(`${consumerUrl}/remove`, req.body);
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Error removing item');
  }
});

module.exports = router;