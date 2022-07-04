import { useState } from "react";
import { useRef } from "react";
import { FaCopy, FaPaperPlane } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { copyToClipBoard, showMessage } from "../helpers/utils";

export default function User() {
  const [state, setState] = useState({
    loading: false,
    fileId: undefined,
  });
  const fileRef = useRef();

  const uploadFile = (e) => {
    e.preventDefault();

    //check the file size
    if (fileRef.current.files[0].size > 10 * 1024 * 1024) {
      showMessage(
        "error",
        "File is too big to process. Miximum limit is 10 MB"
      );
      return false;
    }

    setState({ ...state, loading: true });
    const formData = new FormData();
    formData.append("file", fileRef.current.files[0]);

    fetch(`${process.env.REACT_APP_API_URL}upload`, {
      method: "post",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          showMessage("success", result.message);
          setState({ ...state, loading: false, newFileId: result.data.fileId });
        } else {
          showMessage("error", result.message);
        }
      })
      .catch((error) => {
        showMessage("error", error.message);
      });
  };

  return (
    <div className="card">
      <h5 className="card-header">
        {state.newFileId ? "Share" : "Uplaod"} File
      </h5>
      {state.loading ? (
        <Spinner />
      ) : (
        <div className="card-body">
          {state.newFileId ? (
            <div className="input-group mb-3">
              <p className="form-control">{`${process.env.REACT_APP_BASE_URL}file/${state.newFileId}`}</p>
              <div className="input-group-append">
                <a
                  title="Visit file url"
                  className="btn btn-first btn-outline-secondary"
                  href={`${process.env.REACT_APP_BASE_URL}file/${state.newFileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaPaperPlane />
                </a>
                <button
                  title="Copy file url"
                  className="btn btn-second btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    copyToClipBoard(
                      `${process.env.REACT_APP_BASE_URL}file/${state.newFileId}`
                    )
                  }
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => uploadFile(e)}>
              <input type="file" ref={fileRef} className="form-control" />
              <button className="btn btn-primary mt-3" type="submit">
                Submit
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
