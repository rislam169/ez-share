import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import UserAccessProvider from "./contexts/UserAccessProvider";
import Admin from "./pages/Admin";
import FileInfo from "./pages/FileInfo";
import Files from "./pages/Files";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RequestInfo from "./pages/RequestInfo";
import Requests from "./pages/Requests";
import User from "./pages/User";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        requests: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        files: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: cache,
});

function App() {
  const [userType, setUserType] = useState(null);
  return (
    <>
      <ApolloProvider client={client}>
        <UserAccessProvider.Provider value={{ userType, setUserType }}>
          <Router>
            <Header />
            <ToastContainer />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/upload" element={<User />} />
                <Route path="requests" element={<Requests />} />
                <Route path="requests/:id" element={<RequestInfo />} />
                <Route path="files" element={<Files />} />
                <Route path="file/:id" element={<FileInfo />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </UserAccessProvider.Provider>
      </ApolloProvider>
    </>
  );
}

export default App;
