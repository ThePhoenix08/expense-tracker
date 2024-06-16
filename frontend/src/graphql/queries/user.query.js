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

export const GET_USER_AND_TRANSACTIONS = gql`
  query GetUserAndTransactions($userId: ID!) {
    user(userId: $userId) {
      _id
      name
      username
      profilePicture
      transactions {
        _id
        description
        paymentType
        category
        amount
        location
        date
      }
    }
  }
`;