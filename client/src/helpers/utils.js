import { toast } from "react-toastify";

export function showMessage(type, message) {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      break;
    default:
      toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      break;
  }
}

export function getStatusTheme(status) {
  switch (status) {
    case "Pending":
      return "info";
    case "Accepted":
    case "Unblocked":
      return "success";
    case "Rejected":
      return "danger";
    case "Blocked":
      return "warning";
    default:
      return "info";
  }
}

export function formatFileSize(fileSize) {
  return `${
    fileSize > 1024 || fileSize == 1024
      ? (fileSize / 1024).toFixed(2)
      : parseFloat(fileSize).toFixed(2)
  } ${fileSize > 1024 || fileSize == 1024 ? "MB" : "KB"}`;
}

export function copyToClipBoard(content) {
  navigator.clipboard.writeText(content);
}
