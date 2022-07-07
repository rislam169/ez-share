import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useQuery } from "@apollo/client";
import { GET_REQUEST } from "../queries/requestQueries";
import RequestAction from "../components/RequestAction";
import { FaArrowLeft } from "react-icons/fa";
import { useContext } from "react";
import UserAccessProvider from "../contexts/UserAccessProvider";

export default function RequestDetail() {
  const { userType } = useContext(UserAccessProvider);
  const { id } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_REQUEST, {
    variables: { id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Something Went Wrong. Please try again later</p>;
  if (!data.request.file)
    return <p>The file related to this request not found in the system</p>;

  return (
    <>
      {!loading && !error && (
        <div className="card">
          <h5 className="card-header">
            Request Details
            <Link
              to="/admin"
              className="btn btn-primary btn-sm d-inline ms-auto float-end"
            >
              <FaArrowLeft /> Back
            </Link>
          </h5>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="border border-1 rounded p-3">
                  <strong>Request Id</strong>
                  <p>{data.request.id}</p>

                  <strong>Request Date</strong>
                  <p>{new Date(data.request.createdAt).toLocaleString()}</p>

                  <strong>Request Type</strong>
                  <p>{data.request.type} File</p>

                  <strong>Comment</strong>
                  <p>{data.request.description}</p>

                  <strong>Status</strong>
                  <br />
                  <p className="badge rounded-pill text-bg-info text-white">
                    {data.request.status}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border border-1 rounded p-3  h-100">
                  <strong>File Name</strong>
                  <p>{data.request.file.name}</p>

                  <strong>File Size</strong>
                  <p>{data.request.file.size / 1024} MB</p>

                  <strong>Uploaded At</strong>
                  <p>
                    {new Date(data.request.file.createdAt).toLocaleString()}
                  </p>

                  <strong>Status</strong>
                  <br />
                  <p className="badge rounded-pill text-bg-info text-white">
                    {data.request.file.status}
                  </p>
                </div>
              </div>
            </div>
            {userType === "admin" && (
              <RequestAction
                refetch={refetch}
                requestId={data.request.id}
                requestType={data.request.type}
                fileId={data.request.file.id}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
