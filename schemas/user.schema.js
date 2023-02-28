import gql from 'graphql-tag';

const userSchema = gql`
  input SignupInput {
    email: String!
    password: String!
    fname: String!
    lname: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    getUsers(total: Int): [User]
    getUserById(id: ID!): User!
  }

  type JwtToken {
    token: String!
  }

  type UserWithToken {
    _id: String
    email: String
    fname: String
    lname: String
    following: [String]
    createdAt: DateTime
    updatedAt: DateTime
    userJwtToken: JwtToken
  }

  type Mutation {
    login(input: LoginInput): UserWithToken
    signup(input: SignupInput): UserWithToken
  }
`;

export default userSchema;
