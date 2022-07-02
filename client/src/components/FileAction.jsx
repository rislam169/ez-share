import Swal from "sweetalert2";
import { ADD_REQUEST } from "../mutations/requestMutations.js";
import { useMutation } from "@apollo/client";
import { showMessage } from "../helpers/utils.js";

export default function FileAction({ fileId, status }) {
  const [createRequest] = useMutation(ADD_REQUEST, {
    variables: {
      fileId: fileId,
      type: status === "Block" ? "unblock" : "block",
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
        status === "Block" ? "Unblock" : "Block"
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
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}file/download/${fileId}`,
      {
        method: "post",
      }
    );
    console.log(response);
    let oldBlob = await response.blob();
    let blob = new Blob([oldBlob], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "zip_test.txt";
    link.click();
    // console.log(response.arrayBuffer());
  };

  return (
    <div className="d-flex gap-1">
      {status === "Unblocked" ? (
        <button className="btn btn-primary" onClick={() => downloadFile()}>
          Download
        </button>
      ) : (
        <button className="btn btn-light" disabled={status === "Blockded"}>
          File is blocked
        </button>
      )}

      <button
        className={`btn ${
          status === "Unblocked" ? "btn-outline-secondary" : "btn-primary"
        }`}
        onClick={() => requestAction()}
      >
        Request {status === "Unblocked" ? "Block" : "Unblock"}
      </button>
    </div>
  );
}
