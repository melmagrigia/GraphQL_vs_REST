import React, {useEffect, useState} from "react";
import { User } from "../components/User";
import { Post } from "../components/Post";
import { Comment } from "../components/Comment";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useParams } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import axios from 'axios';

export const UserPage = () => {
  let { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3008/users/${id}`);
        setUser(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (user && user.executionTimes) {
    console.log(user.executionTimes);
  }

  return (
    <Container className="p-3">
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {user &&
         (
          <>
            <User
              userName={user.userName}
              bio={user.bio}
              postCount={user.postsAggregate?.count}
              commentCount={user.commentsAggregate?.count}
            />
            <h2>Posts</h2>
            <div className="postsSection">
              {user.posts.length ? (
                user.posts.map((post) => (
                  <ListGroup>
                    <Post
                      key={post.id}
                      isPreview
                      isOnUserPage
                      id={post.id}
                      title={post.title}
                      voteCount={post.voteCount}
                      commentCount={post.commentsAggregate?.count}
                      subaperitivoName={post.subaperitivo.name}
                      userName={post.user.userName}
                    />
                  </ListGroup>
                ))
              ) : (
                <p>No posts yet!</p>
              )}
            </div>
            <h2>Comments</h2>
            <div className="commentsSection">
              {user.comments.length ? (
                user.comments.map((comment) => (
                  <ListGroup>
                    <Comment
                      key={comment.id}
                      isOnUserPage
                      postTitle={comment.post.title}
                      postId={comment.post.id}
                      commentContent={comment.commentContent}
                      voteCount={comment.voteCount}
                      userName={comment.user.userName}
                    />
                  </ListGroup>
                ))
              ) : (
                <p>No comments yet!</p>
              )}
            </div>
          </>
        )}
    </Container>
  );
};
