import RecipeModel from '../models/recipe.model.js';

const RecipeHelper = {
  isRecipeExists: async (id) => {
    const user = await RecipeModel.findById(id);
    return user ? true : false;
  },
};

export default RecipeHelper;
