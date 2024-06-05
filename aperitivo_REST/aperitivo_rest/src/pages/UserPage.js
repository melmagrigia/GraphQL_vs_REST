import React from "react";
import { User } from "../components/User";
import { Post } from "../components/Post";
import { Comment } from "../components/Comment";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useParams } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";

export const UserPage = () => {
  let { id } = useParams();

  return (
    <Container className="p-3">
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data &&
        (data?.queryUser.length ? (
          <>
            <User
              userName={data.queryUser[0].userName}
              bio={data.queryUser[0].bio}
              postCount={data.queryUser[0].postsAggregate?.count}
              commentCount={data.queryUser[0].commentsAggregate?.count}
            />
            <h2>Posts</h2>
            <div className="postsSection">
              {data.queryUser[0].posts.length ? (
                data.queryUser[0].posts.map((post) => (
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
              {data.queryUser[0].comments.length ? (
                data.queryUser[0].comments.map((comment) => (
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
        ) : (
          <ErrorMessage />
        ))}
    </Container>
  );
};
