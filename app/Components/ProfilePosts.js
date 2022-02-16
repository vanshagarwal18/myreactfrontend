import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";
function ProfilePosts(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPost] = useState([]);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`/profile/${props.username}/posts`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
        // console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, [props.username]);

  if (isLoading)
    return (
      <>
        <LoadingDotsIcon />
      </>
    );
  return (
    <>
      <div className="list-group">
        {posts.map((spost, index) => {
          return <Post noAuthor={true} post={spost} key={spost._id} />;
        })}
      </div>
    </>
  );
}

export default ProfilePosts;
