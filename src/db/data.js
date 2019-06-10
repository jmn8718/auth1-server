const CLIENTS = [
  {
    name: 'client demo',
    clientId: 'id2019',
    clientSecret: 'secret2019',
    redirectUri: 'http://localhost:8080/users/consent',
    userId: 'local-jose@gmail.com',
  },
  {
    name: 'auth app',
    clientId: 'auth19id',
    clientSecret: 'auth10secret',
    redirectUri: 'http://localhost:8080/users/consent',
    userId: 'local-jose@gmail.com',
  },
];

const USERS = [
  {
    username: 'jose@gmail.com',
    userId: 'local-jose@gmail.com',
    connection: 'local',
    password: 'jose',
  },
];

module.exports = {
  CLIENTS,
  USERS,
};

// http://localhost:8080/authorize?client_id=auth19id&redirect_uri=http://localhost:8080/users/consent&state=x
