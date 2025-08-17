




// services/serviceCaller.js
const axios = require('axios');
const eurekaClient = require('./eureka');

function getServiceUrl(serviceName) {
  const instances = eurekaClient.getInstancesByAppId(serviceName.toUpperCase());
  //console.log(`The instance name is ${instances}:`, instances);
  if (!instances || instances.length === 0) {
    throw new Error(`No instances found for ${serviceName}`);
  }
  const instance = instances[0];
  return `http://${instance.ipAddr}:${instance.port.$}`;
}

async function callService(serviceName, endpoint) {
  const baseUrl = getServiceUrl(serviceName);
  try {
    const response = await axios.get(`${baseUrl}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error calling ${serviceName}:`, error.message);
    throw error;
  }
}

async function postService(serviceName, endpoint, req) {
  const baseUrl = getServiceUrl(serviceName);
  try {
    const response = await axios.post(`${baseUrl}${endpoint}`,{
      name: req.body.name,
      quantity: req.body.quantity
    },{
  headers: {
    'Content-Type': 'application/json'
  }
  } );
    return response.data;
  } catch (error) {
    console.error(`❌ Error calling ${serviceName}:`, error.message);
    throw error;
  }
}

module.exports = { callService, postService };
