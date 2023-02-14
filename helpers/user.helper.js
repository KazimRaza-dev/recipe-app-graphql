import UserModel from '../models/user.model.js';

const userHelper = {
  isEmailAlreadyExist: async (email) => {
    const user = await UserModel.findOne({ email: email });
    return user ? true : false;
  },
};

export default userHelper;
