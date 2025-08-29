

const { Eureka } = require('eureka-js-client');

const client = new Eureka({
  instance: {
    app: 'front-gateway',
    hostName: 'front-end', //changed this to try to get docker compose to work with eureka
    ipAddr: 'front-end', //changed this to try to get docker compose to work with eureka
    port: { '$': 3000, '@enabled': true },
    vipAddress: 'front-gateway',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    //host: 'localhost',
    host: 'host.docker.internal',
    //host: 'eureka-server',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});
/*
client.start((error) => {
  if (error) {
    console.error('Eureka registration failed:', error);
  } else {
    console.log('Registered with Eureka as front-gateway');
  }
});
*/
function startEureka() {
  client.start((error) => {
    if (error) {
      console.error('Eureka registration failed:', error);
      setTimeout(startEureka, 5000); // Retry after 5 seconds
    } else {
      console.log('Registered with Eureka as front-gateway');
    }
  });
}

startEureka();


module.exports = client;
