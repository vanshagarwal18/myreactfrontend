import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://backendformyfirstreactapp18.herokuapp.com";

//Context
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

//My Components
import Header from "./Components/Header";
import HomeGuest from "./Components/HomeGuest";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Terms from "./Components/Terms";
import Home from "./Components/Home";
const CreatePost = React.lazy(() => import("./Components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./Components/ViewSinglePost"));
import FlashMessages from "./Components/FlashMessages";
import Profile from "./Components/Profile";
import EditPost from "./Components/EditPost";
import NotFound from "./Components/NotFound";
const Search = React.lazy(() => import("./Components/Search"));
const Chat = React.lazy(() => import("./Components/Chat"));
import LoadingDotsIcon from "./Components/LoadingDotsIcon";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };
  // function ourReducer(state, action) {
  //AFTER USE OF IMMER ABOVE LINE CHNAGES TO
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        //In react we have to pass a new object, we cannot just update existing object
        //That is why we wrote flashMessages here though we are not changing its value.
        //To solve this problem we use IMMER(a npm package which provides draft of our previous object)
        // return { loggedIn: true, flashMessages: state.flashMessages };
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        // return { loggedIn: false, flashMessages: state.flashMessages };
        draft.loggedIn = false;
        return;
      case "flashMessage":
        // return {
        //   loggedIn: state.loggedIn,
        //   flashMessages: state.flashMessages.concat(action.value),
        // };
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        return;
    }
  }
  // const [state, dispatch] = useReducer(ourReducer, initialState);

  //AFTER USE OF IMMER LINE CHANGES TO
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
    }
  }, [state.loggedIn]);
  // dispatch({type:"login"})
  // dispatch({type:"logout"}) You cannot create dispatch like that
  // dispatch({type:"flashMessage", value:"Congrats, u created a post"})

  //*After use of useReducer the following useState were of no use.
  // const [loggedIn, setLoggedIn] = useState(
  //   Boolean(localStorage.getItem("complexappToken"))
  // );
  // const [flashMessages, setFlashMessages] = useState([]);
  // function addFlashMessage(msg) {
  //   setFlashMessages((prev) => prev.concat(msg));
  // }

  //Check if token is expired or not
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchSearch() {
        try {
          const response = await Axios.post(
            "/checkToken",
            {
              token: state.user.token,
            },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "Your session has expired. Please log in again",
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
      fetchSearch();
    }
    return () => ourRequest.cancel();
  }, []);

  return (
    //We are creating different context provider for state and dispatch.
    //Remember every component which is using ExampleContext as context provider
    // will be re rendered each time state or dispatch value is changing
    //So if a component is using only state variable then that will also be re rendered
    // when changes take place in value of dispatch only bcoz
    // dispatch is using same context provider which is shared by state.
    // That is why we are using different context provider for state and dispatch.
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route
                path="/"
                element={state.loggedIn ? <Home /> : <HomeGuest />}
              ></Route>
              <Route path="/profile/:username/*" element={<Profile />}></Route>
              <Route path="/about-us" element={<About />}></Route>
              <Route path="/post/:id/edit" element={<EditPost />}></Route>
              <Route path="/create-post" element={<CreatePost />}></Route>
              <Route path="/terms" element={<Terms />}></Route>
              <Route path="/post/:id" element={<ViewSinglePost />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </Suspense>
          <CSSTransition
            timeout={330}
            classNames="search-overlay"
            in={state.isSearchOpen}
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

//ReactDOM.render(a,b);//Two arguments are given
// a is component we want to render.
// b is place where u want to render on your web page.

ReactDOM.render(<Main />, document.querySelector("#app"));
if (module.hot) {
  module.hot.accept();
}
