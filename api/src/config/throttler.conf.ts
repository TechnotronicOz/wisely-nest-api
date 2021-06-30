export default {
  TTL: +process.env.WIZE_TTL || 60,
  limit: +process.env.WIZE_THROTTLE_LIMIT || 10,
};
