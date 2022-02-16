import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import Page from "./Page";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost(props) {
  let navigate = useNavigate();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: appState.user.token,
      });
      //Redirect to new post url
      // console.log(response);
      // console.log("Post created Successfully");
      appDispatch({
        type: "flashMessage",
        value: "Congrats, you created a post successfully.POPO",
      });
      navigate(`/post/${response.data}`);
    } catch (err) {
      console.log("Error in creating post", err);
    }
  }
  return (
    <Page title="create">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}

export default CreatePost;
