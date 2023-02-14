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

  type InvalidCredentialsError {
    message: String!
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

  union LoginResult = UserWithToken | InvalidCredentialsError

  type EmailAlreadyExistsError {
    message: String!
  }

  union SignupResult = UserWithToken | EmailAlreadyExistsError

  type Mutation {
    login(input: LoginInput): LoginResult
    signup(input: SignupInput): SignupResult
  }
`;

export default userSchema;
