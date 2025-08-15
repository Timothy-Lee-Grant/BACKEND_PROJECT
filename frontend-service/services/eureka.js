










const { Eureka } = require('eureka-js-client');

const client = new Eureka({
  instance: {
    app: 'front-gateway',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: { '$': 3000, '@enabled': true },
    vipAddress: 'front-gateway',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});

client.start((error) => {
  if (error) {
    console.error('Eureka registration failed:', error);
  } else {
    console.log('Registered with Eureka as front-gateway');
  }
});

module.exports = client;
