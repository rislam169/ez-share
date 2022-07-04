import { gql } from "@apollo/client";

const GET_FILES = gql`
  query getFile {
    files {
      id
      name
      status
      type
      size
      createdAt
    }
  }
`;

const GET_FILE = gql`
  query getFile($id: ID!) {
    file(id: $id) {
      id
      name
      size
      type
      status
      createdAt
    }
  }
`;

export { GET_FILE, GET_FILES };
