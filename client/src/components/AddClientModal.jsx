import { useRef } from "react";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { ADD_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queries/clientQueries";

function AddClientModal() {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const phoneRef = useRef("");

  const [addClient] = useMutation(ADD_CLIENT, {
    variables: {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
    },
    update(cache, { data: { addClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });

      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: [...clients, addClient] },
      });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      nameRef.current.value === "" ||
      emailRef.current.value === "" ||
      phoneRef.current.value === ""
    ) {
      return alert("Please fill in all fields");
    }

    addClient({
      variables: {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
      },
    });

    e.target.reset();
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="modal"
        data-bs-target="#clientModal"
      >
        <div className="d-flas align-items-center">
          <FaUser className="icon" />
          Add Client
        </div>
      </button>

      <div
        className="modal fade"
        id="clientModal"
        aria-labelledby="clientModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="clientModalLabel">
                Add Client
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" ref={nameRef} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="text" className="form-control" ref={emailRef} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" ref={phoneRef} />
                </div>
                <button
                  type="submit"
                  data-bs-dismiss="modal"
                  className="btn btn-secondary"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddClientModal;
