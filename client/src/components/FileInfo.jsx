import { useRef } from "react";
import { useMutation } from "@apollo/client";
import { GET_PROJECT } from "../queries/projectQueries";
import { UPDATE_PROJECT } from "../mutations/projectMutations";

export default function FileInfo({ file }) {
  return (
    <div className="mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-offset-3 col-md-6">
            <div className="panel panel-default bootcards-file">
              <div className="panel-heading">
                <h3 className="panel-title">Download Ebook</h3>
              </div>
              <div className="list-group">
                <div className="list-group-item">
                  <a href="#">
                    <i className="icon-file-pdf"></i>
                  </a>
                  <h4 className="list-group-item-heading">
                    <a href="#">Bootcards, a Card-based UI</a>
                  </h4>
                  <p className="list-group-item-text">
                    <strong>PDF</strong>
                  </p>
                  <p className="list-group-item-text">
                    <strong>1.5MB</strong>
                  </p>
                </div>
                <div className="list-group-item">
                  <p className="list-group-item-text">
                    This ebook covers the basics of creating a card-based UI
                    with Bootcards. Bootcards is based on Bootstrap. It includes
                    stylesheets to give your apps a native look, whether that's
                    on iOS, Android or desktop.{" "}
                  </p>
                </div>
              </div>
              <div className="panel-footer">
                <div className="btn-group btn-group-justified">
                  <div className="btn-group">
                    <button className="btn btn-default">
                      <i className="fa fa-arrow-down"></i>
                      Download
                    </button>
                  </div>
                  <div className="btn-group">
                    <button className="btn btn-default">
                      <i className="fa fa-star"></i>
                      Save
                    </button>
                  </div>
                  <div className="btn-group">
                    <button className="btn btn-default">
                      <i className="fa fa-envelope"></i>
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
