import { useRef } from "react";
import { useMutation } from "@apollo/client";
import { GET_PROJECT } from "../queries/projectQueries";
import { UPDATE_PROJECT } from "../mutations/projectMutations";

export default function EditProjectForm({ project }) {
  const nameRef = useRef(project.name);
  const descriptionRef = useRef(project.description);
  const statusRef = useRef(project.status);

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: {
      id: project.id,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      status: statusRef.current.value,
    },
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      nameRef.current.value === "" ||
      descriptionRef.current.value === "" ||
      statusRef.current.value === ""
    ) {
      return alert("Please fill in all fields");
    }

    updateProject({
      variables: {
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        status: statusRef.current.value,
      },
    });
  };

  return (
    <div className="mt-5">
      <h3>Update Project Details</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            ref={nameRef}
            defaultValue={project.name}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            ref={descriptionRef}
            defaultValue={project.description}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            ref={statusRef}
            defaultValue={project.status}
          >
            <option value="new">Not Started</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
