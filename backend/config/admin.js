module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '744d4b841aa38d6432febc0f202aa751'),
  },
});
