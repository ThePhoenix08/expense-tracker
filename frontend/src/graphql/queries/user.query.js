import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthUser {
    authUser {
      _id
      username
      name
      password
      profilePicture
    }
  }
`;
