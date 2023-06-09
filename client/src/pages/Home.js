import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("accessToken")){
      navigate('/login')
    } else{
    axios.get("http://localhost:3030/posts", { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
      setListOfPosts(response.data.listOfPosts);
      setLikedPosts(response.data.likedPosts.map((like) => {return like.PostId}));

    });
  }
  }, []);

  const likeAPost = (postId) => {
    axios.post("http://localhost:3030/likes", { PostId: postId}, { headers: { accessToken: localStorage.getItem("accessToken")}}
    ).then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if(post.id === postId){
          if(response.data.liked){ // if liked then return el of arr
          return{...post, Likes: [...post.Likes, 0]} // adding 0 or anything really so that value.length works still
        }else{ // else copy the array, remove the last item and return the modified arr with one less item
          const likesArray = post.Likes;
          likesArray.pop()
          return {...post, Likes: likesArray}
        }
      } else{
          return post;
        }
      })
      );

      if (likedPosts.includes(postId)) {
        setLikedPosts(
          likedPosts.filter((id) => {
            return id !== postId;
          })
        );
      } else {
        setLikedPosts([...likedPosts, postId]);
      }

    })
  }

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div
            key={key}
            className="post"
          >
            <div className="title"> {value.title} </div>
            <div className="body" onClick={() => {
              navigate(`/post/${value.id}`);
            }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                </div>
              <div className="buttons">
                <ThumbUpIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Home;
