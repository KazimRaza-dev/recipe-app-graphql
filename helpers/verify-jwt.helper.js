import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

// const getUser = (token) => {
//   try {
//     if (token) {
//       return jwt.verify(token, process.env.TOKEN_EXPIRY_TIME);
//     }
//     return null;
//   } catch (error) {
//     return null;
//   }
// };

const getUserByToken = async (req) => {
  let user = null;
  console.log('get user by token called..');
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.includes('bearer')
    ) {
      console.log('in else');
      const token = req.headers.authorization.split(' ')[1];
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        user = decodedToken;
        console.log(user);
        // user = await UserModel.findById(userId);
      }
      return user;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getUserByToken;
