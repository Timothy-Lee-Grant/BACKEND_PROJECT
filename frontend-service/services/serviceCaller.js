




// services/serviceCaller.js
const axios = require('axios');
const eurekaClient = require('./eureka');

function getServiceUrl(serviceName) {
  try {
    const instances = eurekaClient.getInstancesByAppId(serviceName.toUpperCase());
    console.log(`Instances for ${serviceName}:`, instances);
    
    if (!instances || instances.length === 0) {
      // Fallback to direct URLs if service discovery fails
      const fallbackUrls = {
        'PRODUCER_RESOURCE': 'http://localhost:8080',
        'CONSUMER_RESOURCE': 'http://localhost:8082'
      };
      
      if (fallbackUrls[serviceName.toUpperCase()]) {
        console.log(`Using fallback URL for ${serviceName}: ${fallbackUrls[serviceName.toUpperCase()]}`);
        return fallbackUrls[serviceName.toUpperCase()];
      }
      
      throw new Error(`No instances found for ${serviceName}`);
    }
    
    const instance = instances[0];
    const url = `http://${instance.ipAddr}:${instance.port.$}`;
    console.log(`Service URL for ${serviceName}: ${url}`);
    return url;
  } catch (error) {
    console.error(`Error getting service URL for ${serviceName}:`, error.message);
    
    // Fallback to direct URLs
    const fallbackUrls = {
      'PRODUCER_RESOURCE': 'http://localhost:8080',
      'CONSUMER_RESOURCE': 'http://localhost:8082'
    };
    
    if (fallbackUrls[serviceName.toUpperCase()]) {
      console.log(`Using fallback URL for ${serviceName}: ${fallbackUrls[serviceName.toUpperCase()]}`);
      return fallbackUrls[serviceName.toUpperCase()];
    }
    
    throw error;
  }
}

async function callService(serviceName, endpoint) {
  const baseUrl = getServiceUrl(serviceName);
  try {
    console.log(`Calling ${serviceName} at: ${baseUrl}${endpoint}`);
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error calling ${serviceName}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function postService(serviceName, endpoint, req) {
  const baseUrl = getServiceUrl(serviceName);
  console.log(`Posting to ${serviceName} at: ${baseUrl}${endpoint}`);
  console.log('Request body:', req.body);
  
  try {
    const response = await axios.post(`${baseUrl}${endpoint}`, {
      name: req.body.name,
      quantity: req.body.quantity
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    console.log(`Response from ${serviceName}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error calling ${serviceName}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

module.exports = { callService, postService };
