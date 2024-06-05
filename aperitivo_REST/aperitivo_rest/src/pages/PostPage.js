import React from "react";
import { Post } from "../components/Post";
import { Comment } from "../components/Comment";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useParams } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";

export const PostPage = () => {
  let { id } = useParams();

  return (
    <Container>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data &&
        (data.getPost ? (
          <>
            <Post
              title={data.getPost.title}
              voteCount={data.getPost.voteCount}
              commentCount={data.getPost.commentsAggregate?.count}
              subaperitivoName={data.getPost.subaperitivo.name}
              userName={data.getPost.user.userName}
            />
            <h2>Comments</h2>
            <div className="commentsSection">
              {data.getPost.comments.length ? (
                data.getPost.comments.map((comment) => (
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
        ) : (
          <ErrorMessage />
        ))}
    </Container>
  );
};
