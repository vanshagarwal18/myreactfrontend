import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Whoops, we cannot find that page.</h2>
        <p className="lead text-muted">
          You can always visit <Link to="/">homepage</Link>for freah start.
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
