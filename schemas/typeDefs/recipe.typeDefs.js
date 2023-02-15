import gql from 'graphql-tag';

const recipeTypeDefs = gql`
  type Recipe {
    id: ID
    name: String
    description: String
    createdAt: String
    thumbsUp: Int
    thumbsDown: Int
  }
`;
export default recipeTypeDefs;
