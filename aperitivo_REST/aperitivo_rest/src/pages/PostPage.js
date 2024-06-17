import React, {useEffect, useState} from "react";
import { Post } from "../components/Post";
import { Comment } from "../components/Comment";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useParams } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import axios from 'axios';

export const PostPage = () => {
  let { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3008/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (post && post.executionTimes) {
    console.log(post.executionTimes);
  }

  return (
    <Container>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {post &&
        (
          <>
            <Post
              title={post.title}
              voteCount={post.voteCount}
              commentCount={post.commentsAggregate?.count}
              subaperitivoName={post.subaperitivo.name}
              userName={post.user.userName}
            />
            <h2>Comments</h2>
            <div className="commentsSection">
              {post.comments.length ? (
                post.comments.map((comment) => (
                  <ListGroup>
                    <Comment
                      key={comment.commentContent}
                      isOnPostPage
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
