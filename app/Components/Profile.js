import React, { useContext, useEffect } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";
function Profile(props) {
  let navigate = useNavigate();
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      counts: { postCount: 0, followerCount: 0, followingCount: 0 },
      isFollowing: false,
      profileAvatar:
        "https://gravatar.com/avatar/b4dbad7eca77f9bf4bb2c5ed888a4760?s=128",
      profileUsername: "...",
    },
  });
  const { username } = useParams();
  const appState = useContext(StateContext);
  useEffect(() => {
    if (appState.loggedIn == false) {
      navigate("/");
    }
  }, [appState.loggedIn]);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const profile = await Axios.post(`/profile/${username}`, {
          token: appState.user.token,
          cancelToken: ourRequest.token,
        });
        setState((draft) => {
          draft.profileData = profile.data;
        });
        // console.log(profile.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
    return () => {
      ourRequest.cancel("Component rendering cancelled");
    };
  }, [username]);
  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.followActionLoading = false;
            draft.profileData.counts.followerCount++;
          });
        } catch (err) {
          console.log(err);
        }
      }
      fetchData();
      return () => ourRequest.cancel();
    }
  }, [state.startFollowingRequestCount]);
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.followActionLoading = false;
            draft.profileData.counts.followerCount--;
          });
        } catch (err) {
          console.log(err);
        }
      }
      fetchData();
      return () => ourRequest.cancel();
    }
  }, [state.stopFollowingRequestCount]);
  async function startFollowing() {
    setState((draft) => {
      draft.followActionLoading = true;
      draft.startFollowingRequestCount++;
    });
  }
  async function stopFollowing() {
    setState((draft) => {
      draft.followActionLoading = true;
      draft.stopFollowingRequestCount++;
    });
  }
  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink end to={``} className=" nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to={`followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Routes>
        <Route path="" element={<ProfilePosts username={username} />}></Route>
        <Route path="followers" element={<ProfileFollowers />}></Route>
        <Route
          path="following"
          element={<ProfileFollowing setState={setState} />}
        ></Route>
      </Routes>
    </Page>
  );
}

export default Profile;
