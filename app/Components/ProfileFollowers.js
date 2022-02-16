import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
function ProfileFollowers(props) {
  const { username } = useParams();
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, {
          cancelToken: ourRequest.token,
        });
        // console.log(response.data);
        setFollowers(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);
  if (isLoading)
    return (
      <>
        <LoadingDotsIcon />
      </>
    );
  return (
    <>
      <div className="list-group">
        {followers.map((follower, index) => {
          return (
            <Link
              to={`/profile/${follower.username}`}
              key={index}
              className="list-group-item list-group-item-action"
            >
              {" "}
              <img className="avatar-tiny" src={follower.avatar} />{" "}
              {follower.username}{" "}
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default ProfileFollowers;
