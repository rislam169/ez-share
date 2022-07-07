import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useQuery } from "@apollo/client";
import { GET_FILE } from "../queries/fileQueries";
import FileAction from "../components/FileAction";
import CloudIcon from "../components/assets/cloud.png";
import FileIcon from "../components/assets/file.png";
import { formatFileSize } from "../helpers/utils";

export default function FileInfo() {
  const { id } = useParams();
  console.log(id);
  const { loading, error, data, refetch } = useQuery(GET_FILE, {
    variables: { id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Something Went Wrong. Please try again later</p>;
  if (!data.file) return <p>File not found in the system.</p>;

  return (
    <>
      {!loading && !error && (
        <div className="card-body">
          <div className="row vh-80">
            <div className="col-md-12 d-grid place-item-center">
              <div className="d-flex gap-5 mx-auto">
                <img width={200} src={CloudIcon} alt="Share Logo" />
                <div className="d-flex flex-column justify-content-between">
                  <div className="d-flex gap-1">
                    <img
                      height={60}
                      width={60}
                      src={FileIcon}
                      alt="File Icon"
                    />
                    <div>
                      <p className="m-0">{data.file.name}</p>
                      <small className="text-muted">
                        {formatFileSize(data.file.size)}
                      </small>
                      <br />
                      <small className="text-muted">
                        {new Date(data.file.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <FileAction file={data.file} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
