import React, { useEffect, useContext } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import Post from "./Post";
import { Link } from "react-router-dom";
function Search() {
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);
  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 750);
      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    if (state.requestCount) {
      async function fetchSearch() {
        try {
          const response = await Axios.post(
            "/search",
            {
              searchTerm: state.searchTerm,
            },
            { cancelToken: ourRequest.token }
          );

          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (err) {
          console.log(err);
        }
      }
      fetchSearch();
    }
    return () => ourRequest.cancel();
  }, [state.requestCount]);
  function searchKeyPressHandler(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  }
  function handleInput(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  }
  return (
    <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            onChange={handleInput}
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span
            onClick={(e) => appDispatch({ type: "closeSearch" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show == "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show == "results" ? "live-search-results--visible" : "")
            }
          >
            <div className="list-group shadow-sm">
              {state.results.length ? (
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}{" "}
                  {state.results.length <= 1 ? " item " : " items "}
                  found)
                </div>
              ) : (
                <p className="alert alert-danger text-center shadow-sm">
                  Sorry, we could not find any results.
                </p>
              )}
              {state.results.map((post) => {
                return (
                  <Post
                    post={post}
                    key={post._id}
                    onClick={(e) => {
                      appDispatch({ type: "closeSearch" });
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
