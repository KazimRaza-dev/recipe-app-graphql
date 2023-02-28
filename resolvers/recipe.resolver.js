import RecipeModel from '../models/recipe.model.js';
import RecipeHelper from '../helpers/recipe.helper.js';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';

const recipeResolver = {
  Query: {
    recipe: async (parent, { id }, contextValue) => {
      const recipe = await RecipeModel.findById(id);
      if (!recipe) {
        throwCustomError(
          `Recipe with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      return {
        id: recipe._id,
        ...recipe._doc,
      };
    },

    async getRecipes(parent, args, contextValue) {
      // console.log(contextValue);
      const amount = args.amount;
      const allRecipes = await RecipeModel.find()
        .sort({ createdAt: -1 })
        .limit(amount);
      return allRecipes;
    },
  },

  Mutation: {
    // destructure the args object to get recipeInput object and then destructure
    // recipeInput to get the name and description properties
    createRecipe: async (
      parent,
      { recipeInput: { name, description } },
      contextValue
    ) => {
      const createdRecipe = new RecipeModel({
        name: name,
        description: description,
        createdAt: new Date().toISOString(),
        thumbsUp: 0,
        thumbsDown: 0,
      });
      const res = await createdRecipe.save();
      return {
        id: res.id,
        ...res._doc,
      };
    },

    deleteRecipe: async (_, { id }, contextValue) => {
      const isExists = await RecipeHelper.isRecipeExists(id);
      if (!isExists) {
        throwCustomError(
          `Recipe with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      const isDeleted = (await RecipeModel.deleteOne({ _id: id })).deletedCount;
      return {
        isSuccess: isDeleted, // return true if something is deleted, 0 if nothing is deleted
        message: 'Recipe deleted.',
      };
    },

    editRecipe: async (
      _,
      { id, recipeInput: { name, description } },
      { user }
    ) => {
      const isExists = await RecipeHelper.isRecipeExists(id);
      if (!isExists) {
        throwCustomError(
          `Recipe with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      const isEdited = (
        await RecipeModel.updateOne(
          { _id: id },
          { name: name, description: description }
        )
      ).modifiedCount;
      return {
        isSuccess: isEdited, // return 1 if something is edited, 0 if nothing is edited
        message: 'Recipe Edited.',
      };
    },

    incrementThumbsUp: async (_, { id }, { user }) => {
      const isExists = await RecipeHelper.isRecipeExists(id);
      if (!isExists) {
        throwCustomError(
          `Recipe with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      await RecipeModel.findByIdAndUpdate(
        { _id: id },
        {
          $inc: { thumbsUp: 1 },
        },
        { new: true }
      );

      return {
        isSuccess: true,
        message: 'Thumbs up incremented..',
      };
    },

    incrementThumbsDown: async (_, { id }, { user }) => {
      const isExists = await RecipeHelper.isRecipeExists(id);
      if (!isExists) {
        throwCustomError(
          `Recipe with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      await RecipeModel.findByIdAndUpdate(
        { _id: id },
        {
          $inc: { thumbsDown: 1 },
        },
        { new: true }
      );
      return {
        isSuccess: true,
        message: 'Thumbs Down incremented..',
      };
    },
  },
};

export default recipeResolver;
