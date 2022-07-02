import { useQuery } from "@apollo/client";
import { GET_REQUESTS } from "../queries/requestQueries";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

function Request() {
  const { loading, error, data } = useQuery(GET_REQUESTS, {
    variables: { status: "Pending" },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong...</p>;
  if (!data.requests[0]) return <p>No Pending Request Found</p>;

  return (
    <>
      {!loading && !error && (
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Request No</th>
              <th>Request Id</th>
              <th>Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.requests.map((request, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <Link
                    className="text-decoration-none"
                    to={`/requests/${request.id}`}
                  >
                    Req#{request.id}
                  </Link>
                </td>
                <td>
                  <p className="badge rounded-pill text-bg-info text-white">
                    {request.status}
                  </p>
                </td>
                <td>{new Date(request.createdAt).toLocaleString()}</td>
                <td>
                  <Link
                    className="btn btn-secondary btn-sm"
                    to={`/requests/${request.id}`}
                  >
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Request;
