import gql from 'graphql-tag';

const recipeSchema = gql`
  input RecipeInput {
    name: String!
    description: String!
  }

  type Query {
    recipe(id: ID!): Recipe!
    getRecipes(amount: Int): [Recipe]
  }

  type Mutation {
    createRecipe(recipeInput: RecipeInput): Recipe!
    deleteRecipe(id: ID!): Boolean
    editRecipe(id: ID!, recipeInput: RecipeInput): Boolean
    incrementThumbsUp(id: ID!): Boolean
    incrementThumbsDown(id: ID!): Boolean
  }
`;

export default recipeSchema;
