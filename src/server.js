const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });
  // TESTING

  server.route(routes);

  await server.start();
  console.log(`Server running on port ${server.info.uri}`);
};

init();
