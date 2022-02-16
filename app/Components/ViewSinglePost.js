import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
function ViewSinglePost() {
  let navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState({ author: {} });
  useEffect(() => {
    async function fetchPostData() {
      try {
        const response = await Axios.get(`/post/${id}`);
        setPostData(response.data);
        setIsLoading(false);
        // console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPostData();
  }, [id]);
  if (!isLoading && !postData) {
    return <NotFound />;
  }
  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />{" "}
      </Page>
    );
  const date = new Date(postData.createdDate).toLocaleDateString();
  function isOwner() {
    return postData.author.username === appState.user.username;
  }
  async function deleteHandler() {
    const areYouSure = window.confirm(
      "Do you really want to delete this post?"
    );
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        });
        if (response.data == "Success") {
          appDispatch({
            type: "flashMessage",
            value: "Post deleted successfully",
          });
          navigate(`/profile/${appState.user.username}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  return (
    <Page title="Post">
      <div className="d-flex justify-content-between">
        <h2>{postData.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />
            {"  "}

            {/* Same id as data-for attribute */}
            <a
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${postData.author.username}`}>
          <img className="avatar-tiny" src={postData.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${postData.author.username}`}>
          {postData.author.username}
        </Link>{" "}
        on {date}
      </p>

      <div className="body-content">
        <ReactMarkdown
          children={postData.body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
            "listItem",
          ]}
        />{" "}
      </div>
    </Page>
  );
}

export default ViewSinglePost;
