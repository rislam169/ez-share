import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { FaCopy, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  copyToClipBoard,
  formatFileSize,
  getStatusTheme,
} from "../helpers/utils";
import { GET_FILES } from "../queries/fileQueries";

export default function Files() {
  const [getFiles, { called, loading, data, error }] = useLazyQuery(GET_FILES, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    getFiles();
  }, []);

  if (called && loading) return <Spinner />;
  if (error) return <p>Something went wrong...</p>;
  if (!data?.files[0]) return <p>No files found</p>;

  return (
    <div className="card">
      <h5 className="card-header">All Files</h5>
      <div className="card-body">
        {!loading && !error && (
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th>File No</th>
                <th>File Name</th>
                <th>Size</th>
                <th>Status</th>
                <th>Uploaded At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.files.map((file, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <p>{file.name}</p>
                  </td>
                  <td>
                    <p>{formatFileSize(file.size)}</p>
                  </td>
                  <td>
                    <p
                      className={`badge rounded-pill text-bg-${getStatusTheme(
                        file.status
                      )} text-white`}
                    >
                      {file.status}
                    </p>
                  </td>
                  <td>{new Date(file.createdAt).toLocaleString()}</td>
                  <td>
                    <Link
                      title="Visit the file"
                      className="btn btn-outline-secondary me-2"
                      to={`/file/${file.id}`}
                    >
                      <FaPaperPlane />
                    </Link>
                    <button
                      title="Copy file url"
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() =>
                        copyToClipBoard(
                          `${process.env.REACT_APP_BASE_URL}file/${file.id}`
                        )
                      }
                    >
                      <FaCopy />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
