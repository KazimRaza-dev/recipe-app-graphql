import jwt from 'jsonwebtoken';

const getUser = async (req) => {
  try {
    console.log('Context is called..');
    const token = req.headers.authorization || '';
    if (token) {
      const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const context = async ({ req, res }) => ({
  isLogged: true, // not using
  user: await getUser(req),
});

export default context;
