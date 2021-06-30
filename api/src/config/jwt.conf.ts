export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'thisisoursupersecretkey!',
  expiresIn: '60s',
};
