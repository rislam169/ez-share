import { useQuery } from "@apollo/client";
import ProjectRow from "./ProjectRow";
import { GET_PROJECTS } from "../queries/projectQueries";
import Spinner from "./Spinner";

function Projects() {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong...</p>;

  return (
    <>
      {!loading && !error && (
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Projects;
