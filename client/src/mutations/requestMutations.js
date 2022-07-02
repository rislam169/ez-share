import { gql } from "@apollo/client";

const ADD_REQUEST = gql`
  mutation AddRequest(
    $description: String!
    $fileId: ID!
    $type: RequestType!
  ) {
    addRequest(description: $description, fileId: $fileId, type: $type) {
      id
      description
      status
    }
  }
`;

const REJECT_REQUEST = gql`
  mutation RejectRequest($id: ID!) {
    rejectRequest(id: $id) {
      id
      status
    }
  }
`;

const ACCEPT_REQUEST = gql`
  mutation AcceptRequest($id: ID!) {
    acceptRequest(id: $id) {
      id
      status
    }
  }
`;

export { ADD_REQUEST, REJECT_REQUEST, ACCEPT_REQUEST };
