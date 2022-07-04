import Request from "../components/Request";

function Admin() {
  return (
    <div className="card">
      <h5 className="card-header">Pending Request</h5>
      <div className="card-body">
        <Request status="Pending" />
      </div>
    </div>
  );
}

export default Admin;
