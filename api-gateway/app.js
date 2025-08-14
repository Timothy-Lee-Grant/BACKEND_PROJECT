const express = require('express');
const inventoryRoutes = require('./routes/inventory');
const eurekaClient = require('./eurekaClient');

const app = express();
app.use(express.json());

app.use('/inventory', inventoryRoutes);

eurekaClient.start((error) => {
  if (error) {
    console.error('Eureka registration failed:', error);
  } else {
    console.log('API Gateway registered with Eureka');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
