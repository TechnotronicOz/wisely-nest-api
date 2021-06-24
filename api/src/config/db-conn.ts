export default {
  host: process.env.WISE_HOST || 'localhost',
  port: +process.env.WISE_PORT || 5459,
  username: process.env.WISE_USER || 'wisely',
  password: process.env.WISE_PW || 'wisely123',
  database: 'wisely',
};
