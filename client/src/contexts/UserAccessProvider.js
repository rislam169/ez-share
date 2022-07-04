import { createContext } from "react";

const UserAccessProvider = createContext({
  userType: false,
  setUserType: (type) => {},
});

export default UserAccessProvider;
