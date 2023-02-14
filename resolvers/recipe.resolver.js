import RecipeModel from '../models/recipe.model.js';

const recipeResolver = {
  Query: {
    recipe: async (parent, { id }) => {
      const recipe = await RecipeModel.findById(id);
      return recipe;
    },
    async getRecipes(parent, args, context) {
      console.log(context);
      console.log(context.authorization);
      console.log('called get recipes');
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
    createRecipe: async (parent, { recipeInput: { name, description } }) => {
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

    deleteRecipe: async (_, { id }) => {
      const isDeleted = (await RecipeModel.deleteOne({ _id: id })).deletedCount;
      return isDeleted; // return true if something is deleted, 0 if nothing is deleted
    },

    editRecipe: async (_, { id, recipeInput: { name, description } }) => {
      const isEdited = (
        await RecipeModel.updateOne(
          { _id: id },
          { name: name, description: description }
        )
      ).modifiedCount;
      return isEdited; // return 1 if something is edited, 0 if nothing is edited
    },

    incrementThumbsUp: async (_, { id }) => {
      await RecipeModel.findByIdAndUpdate(
        { _id: id },
        {
          $inc: { thumbsUp: 1 },
        },
        { new: true }
      );
      return true;
    },

    incrementThumbsDown: async (_, { id }) => {
      await RecipeModel.findByIdAndUpdate(
        { _id: id },
        {
          $inc: { thumbsDown: 1 },
        },
        { new: true }
      );
      return true;
    },
  },
};

export default recipeResolver;
