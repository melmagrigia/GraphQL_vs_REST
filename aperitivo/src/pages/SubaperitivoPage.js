import React from "react";
import { useQuery, gql } from "@apollo/client";
import Subaperitivo from "../components/Subaperitivo";
import { Post } from "../components/Post";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useParams } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";

export const SubaperitivoPage = () => {
  let { id } = useParams();

  const FETCH_SUBAPERITIVO_WITH_POSTS = gql`
    query FetchSubaperitivoWithPosts {
      querySubaperitivo(filter: { name: { eq: "${id}" } }) {
        name
        description
        posts {
          id
          title
          user {
            userName
          }
          voteCount
          commentsAggregate {
            count
          }
        }
      }
    }
  `;

  const { loading, data, error } = useQuery(FETCH_SUBAPERITIVO_WITH_POSTS);

  return (
    <Container>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data &&
        (data?.querySubaperitivo.length ? (
          <>
            <Subaperitivo
              title={data.querySubaperitivo[0].name}
              description={data.querySubaperitivo[0].description}
            />
            <h2>Posts</h2>
            {data.querySubaperitivo[0].posts.length ? (
              data.querySubaperitivo[0].posts.map((post) => (
                <ListGroup>
                  <Post
                    key={post.id}
                    isPreview
                    isOnSubapertivoPage
                    id={post.id}
                    title={post.title}
                    voteCount={post.voteCount}
                    commentCount={post.commentsAggregate?.count}
                    subapertivoName={data.querySubaperitivo[0].name}
                    userName={post.user.userName}
                  />
                </ListGroup>
              ))
            ) : (
              <p>No posts yet!</p>
            )}
          </>
        ) : (
          <ErrorMessage />
        ))}
    </Container>
  );
};
