import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

const getUser = async (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const context = async ({ req, res }) => {
  //   console.log(req.body.operationName);
  if (req.body.operationName === 'IntrospectionQuery') {
    console.log('blocking introspection query..');
    return {};
  }
  if (
    req.body.operationName === 'CreateUser' ||
    req.body.operationName === 'Login'
  ) {
    return {};
  }

  // get the user token from the headers
  const token = req.headers.authorization || '';

  // try to retrieve a user with the token
  const user = await getUser(token);

  if (!user)
    // throwing a `GraphQLError` here allows us to specify an HTTP status code,
    // standard `Error`s will have a 500 status code by default
    throw new GraphQLError('User is not Authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });

  // add the user to the context
  return { user };
};

export default context;
