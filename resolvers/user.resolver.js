import UserModel from '../models/user.model.js';
import userHelper from '../helpers/user.helper.js';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

const userResolver = {
  Query: {
    // Destructing {total} is same sa args.total
    getUsers: async (_, { total }, contextValue) => {
      try {
        console.log('Context is get All user');
        console.log(contextValue);
        if (!contextValue.user) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        // if (!user) throw new Error('You are not authenticated!');
        const users = await UserModel.find()
          .sort({ createdAt: -1 })
          .limit(total);
        return users;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getUserById: async (_, { id }, contextValue) => {
      try {
        console.log(contextValue);
        if (!contextValue.user) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const user = await UserModel.findById(id);
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      try {
        const { email, password, fname, lname } = input;
        const isUserExists = await userHelper.isEmailAlreadyExist(email);
        if (isUserExists) {
          return {
            __typename: 'EmailAlreadyExistsError',
            message: 'Email already Register. Use Different one',
          };
        }
        const userToCreate = new UserModel({
          email: email,
          password: password,
          fname: fname,
          lname: lname,
          following: [],
        });
        const user = await userToCreate.save();
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: process.env.TOKEN_EXPIRY_TIME }
        );

        return {
          __typename: 'UserWithToken',
          ...user._doc,
          userJwtToken: {
            token: token,
          },
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    login: async (_, { input: { email, password } }, context) => {
      try {
        console.log(context);
        console.log('Context is login');
        if (!context.user) {
          throw new GraphQLError('User is not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        const user = await UserModel.findOne({
          $and: [{ email: email }, { password: password }],
        });
        if (user) {
          return {
            __typename: 'UserWithToken',
            ...user._doc,
          };
        }
        return {
          __typename: 'InvalidCredentialsError',
          message: 'Invalid email or password.',
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

export default userResolver;
