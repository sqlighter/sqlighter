
module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      socketPath: env('DATABASE_SOCKETPATH'), // or DATABASE_HOST
      host: env('DATABASE_HOST'), // or DATABASE_SOCKETPATH for Google CloudSQL
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
    },
  },
});
