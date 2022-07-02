import { gql } from "@apollo/client";

const GET_REQUESTS = gql`
  query getRequest($status: String!) {
    requests(status: $status) {
      id
      status
      type
      createdAt
    }
  }
`;

const GET_REQUEST = gql`
  query getRequest($id: ID!) {
    request(id: $id) {
      id
      description
      status
      type
      createdAt
      file {
        id
        name
        size
        type
        status
        createdAt
      }
    }
  }
`;

export { GET_REQUESTS, GET_REQUEST };
