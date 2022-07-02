import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import RequestDetail from "./pages/RequestDetail";
import File from "./pages/File";
import Project from "./pages/Project";
import NotFound from "./pages/NotFound";
import Legacy from "./pages/Legacy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <ToastContainer />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/legacy" element={<Legacy />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/user" element={<User />} />
              <Route path="requests/:id" element={<RequestDetail />} />
              <Route path="file/:id" element={<File />} />
              <Route path="projects/:id" element={<Project />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
