import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_REQUESTS } from "../queries/requestQueries";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { getStatusTheme } from "../helpers/utils";
import { useEffect } from "react";

function Request({ status }) {
  const [getRequests, { called, loading, data, error }] = useLazyQuery(
    GET_REQUESTS,
    {
      variables: { status: status },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    getRequests();
  }, []);

  if (called && loading) return <Spinner />;
  if (error) return <p>Something went wrong...</p>;
  if (!data?.requests[0]) return <p>No Pending Request Found</p>;

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
                  <p
                    className={`badge rounded-pill text-bg-${getStatusTheme(
                      request.status
                    )} text-white`}
                  >
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
