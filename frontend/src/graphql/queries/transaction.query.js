import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query transactions {
    transactions {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

export const GET_TRANSACTION = gql`
  query getOneTransaction($input: ID!) {
    transaction(transactionId: $input) {
      _id
      userId
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;
