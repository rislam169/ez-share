import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProjectRow({ project }) {
  return (
    <tr>
      <td>{project.name}</td>
      <td>{project.status}</td>
      <td>
        <Link
          className="btn btn-secondary btn-sm"
          to={`/projects/${project.id}`}
        >
          <FaEye />
        </Link>
      </td>
    </tr>
  );
}

export default ProjectRow;
