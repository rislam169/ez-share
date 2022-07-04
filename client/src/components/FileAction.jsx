import Swal from "sweetalert2";
import { ADD_REQUEST } from "../mutations/requestMutations.js";
import { useMutation } from "@apollo/client";
import { showMessage } from "../helpers/utils.js";

export default function FileAction({ file }) {
  const [createRequest] = useMutation(ADD_REQUEST, {
    variables: {
      fileId: file.id,
      type: file.status === "Blocked" ? "unblock" : "block",
    },
    onCompleted: () =>
      showMessage(
        "success",
        "Your request has been submitted successfully! Be patient untill admin approve your request."
      ),
    onError: (error) => showMessage("error", error.message),
  });

  const requestAction = () => {
    Swal.fire({
      title: `Please describe why this file should ${
        file.status === "Blocked" ? "Unblock" : "Block"
      }`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: (value) => {
        if (value) {
          return value;
        } else {
          Swal.showValidationMessage(
            `Valid reason not found. Please provide valid reason to send request.`
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          createRequest({ variables: { description: result.value } });
        } else {
          Swal.showValidationMessage(
            `Valid reason not found. Please provide valid reason to send request.`
          );
        }
      }
    });
  };

  const downloadFile = async () => {
    fetch(`${process.env.REACT_APP_API_URL}file/download/${file.id}`, {
      method: "post",
    })
      .then((response) => {
        response.blob().then((blob) => {
          let newblob = new Blob([blob], { type: file.type });

          let link = document.createElement("a");
          link.href = URL.createObjectURL(newblob);
          link.download = file.name;
          link.click();
        });
      })
      .catch((error) => {
        console.error(error);
        showMessage("error", error.message);
      });
  };

  return (
    <div className="d-flex gap-1">
      {file.status === "Unblocked" ? (
        <button className="btn btn-primary" onClick={() => downloadFile()}>
          Download
        </button>
      ) : (
        <button className="btn btn-light" disabled={file.status === "Blockded"}>
          File is blocked
        </button>
      )}

      <button
        className={`btn ${
          file.status === "Unblocked" ? "btn-outline-secondary" : "btn-primary"
        }`}
        onClick={() => requestAction()}
      >
        Request {file.status === "Unblocked" ? "Block" : "Unblock"}
      </button>
    </div>
  );
}
