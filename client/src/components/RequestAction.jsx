import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCheck, FaTrash } from "react-icons/fa";
import {
  ACCEPT_REQUEST,
  REJECT_REQUEST,
} from "../mutations/requestMutations.js";
import { GET_REQUESTS } from "../queries/requestQueries";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import Spinner from "./Spinner.jsx";
import { showMessage } from "../helpers/utils.js";

export default function RequestAction({
  requestId,
  requestType,
  fileId,
  refetch,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [rejectRequest] = useMutation(REJECT_REQUEST, {
    variables: { id: requestId },
    onCompleted: () => navigate("/admin"),
    refetchQueries: [{ query: GET_REQUESTS, variables: { status: "Pending" } }],
  });

  const [acceptRequest] = useMutation(ACCEPT_REQUEST, {
    variables: { id: requestId },
    onCompleted: () => navigate("/admin"),
    refetchQueries: [{ query: GET_REQUESTS, variables: { status: "Pending" } }],
  });

  const requestAction = (action) => {
    if (requestType === "Block") {
      action === "accept"
        ? confirmAction("Block", blockFile)
        : confirmAction("Reject", rejectRequest);
    } else {
      action === "accept"
        ? confirmAction("Unblock", unblockFile)
        : rejectRequest();
    }
  };

  const confirmAction = (actionType, callBack) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionType} it`,
    }).then((result) => {
      if (result.isConfirmed) {
        callBack();
      }
    });
  };

  const blockFile = () => {
    updateFileStatus(`${process.env.REACT_APP_API_URL}block`, {
      requestId,
      fileId,
    });
  };

  const unblockFile = () => {
    updateFileStatus(`${process.env.REACT_APP_API_URL}unblock`, {
      requestId,
      fileId,
    });
  };

  const updateFileStatus = (url, data) => {
    setLoading(true);

    fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        showMessage("success", result.message);
        acceptRequest();
      })
      .catch((error) => {
        showMessage("error", error.message);
        setLoading(false);
      });
  };

  return (
    <div className="d-flex mt-5 align-items-center">
      <button
        className="btn btn-danger m-2"
        onClick={() => requestAction("reject")}
      >
        <FaTrash className="icon" /> Reject
      </button>
      <button
        className="btn btn-success m-2"
        onClick={() => requestAction("accept")}
      >
        <FaCheck className="icon" /> Accept
      </button>
      {loading && <Spinner />}
    </div>
  );
}
