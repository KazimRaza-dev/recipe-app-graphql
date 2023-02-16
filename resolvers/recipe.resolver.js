import RecipeModel from '../models/recipe.model.js';
import RecipeHelper from '../helpers/recipe.helper.js';

const recipeResolver = {
  Query: {
    recipe: async (parent, { id }, contextValue) => {
      const recipe = await RecipeModel.findById(id);
      if (!recipe) {
        return {
          __typename: 'NotExistsError',
          message: `Recipe with id ${id} does not exists.`,
        };
      }
      return {
        __typename: 'Recipe',
        ...recipe._doc,
        id: recipe._id,
      };
    },
    async getRecipes(parent, args, contextValue) {
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
        return {
          __typename: 'NotExistsError',
          message: `Recipe with id ${id} does not exists.`,
        };
      }
      const isDeleted = (await RecipeModel.deleteOne({ _id: id })).deletedCount;
      return {
        __typename: 'RecipeSuccess',
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
        return {
          __typename: 'NotExistsError',
          message: `Recipe with id ${id} does not exists.`,
        };
      }
      const isEdited = (
        await RecipeModel.updateOne(
          { _id: id },
          { name: name, description: description }
        )
      ).modifiedCount;
      return {
        __typename: 'RecipeSuccess',
        isSuccess: isEdited, // return 1 if something is edited, 0 if nothing is edited
        message: 'Recipe Edited.',
      };
    },

    incrementThumbsUp: async (_, { id }, { user }) => {
      const isExists = await RecipeHelper.isRecipeExists(id);
      if (!isExists) {
        return {
          __typename: 'NotExistsError',
          message: `Recipe with id ${id} does not exists.`,
        };
      }
      await RecipeModel.findByIdAndUpdate(
        { _id: id },
        {
          $inc: { thumbsUp: 1 },
        },
        { new: true }
      );

      return {
        __typename: 'RecipeSuccess',
        isSuccess: true,
        message: 'Thumbs up incremented..',
      };
    },

    incrementThumbsDown: async (_, { id }, { user }) => {
      const isExists = await RecipeHelper.isRecipeExists(id);
      if (!isExists) {
        return {
          __typename: 'NotExistsError',
          message: `Recipe with id ${id} does not exists.`,
        };
      }
      await RecipeModel.findByIdAndUpdate(
        { _id: id },
        {
          $inc: { thumbsDown: 1 },
        },
        { new: true }
      );
      return {
        __typename: 'RecipeSuccess',
        isSuccess: true,
        message: 'Thumbs Down incremented..',
      };
    },
  },
};

export default recipeResolver;
