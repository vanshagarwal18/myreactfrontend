import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
function HeaderLoggedIn(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  function handleLogout() {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "You have logged out successfully",
    });
    // localStorage.removeItem("complexappToken");
    // localStorage.removeItem("complexappUsername");
    // localStorage.removeItem("complexappAvatar");
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        data-tip="Search"
        data-for="search"
        onClick={(e) => {
          e.preventDefault();
          appDispatch({ type: "openSearch" });
        }}
        href=""
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      {"   "}
      <span
        data-tip="Chat"
        data-for="chat"
        onClick={() => {
          appDispatch({ type: "toggleChat" });
        }}
        className={
          "mr-2 header-chat-icon " +
          (appState.unreadChatCount ? "text-danger" : "text-white")
        }
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount > 0 && (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount <= 9 ? appState.unreadChatCount : "9+"}
          </span>
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />
      {"   "}
      <Link
        data-tip="Profile"
        data-for="profile"
        to={`/profile/${appState.user.username}`}
        className="mr-2"
      >
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      {"   "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      {"   "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
      {"   "}
    </div>
  );
}

export default HeaderLoggedIn;
