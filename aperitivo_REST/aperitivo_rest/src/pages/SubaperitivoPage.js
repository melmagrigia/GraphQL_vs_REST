import React, {useEffect, useState} from "react";
import Subaperitivo from "../components/Subaperitivo";
import { Post } from "../components/Post";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useParams } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import axios from 'axios';

export const SubaperitivoPage = () => {
  let { id } = useParams();
  const [subaperitivo, setSubaperitivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubaperitivo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/subaperitivos/${id}`);
        setSubaperitivo(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubaperitivo();
  }, [id]);

  if (subaperitivo && subaperitivo.executionTimes) {
    console.log(subaperitivo.executionTimes);
  }

  return (
    <Container>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {subaperitivo &&
        (
          <>
            <Subaperitivo
              title={subaperitivo.name}
              description={subaperitivo.description}
            />
            <h2>Posts</h2>
            {subaperitivo.posts.length ? (
              subaperitivo.posts.map((post) => (
                <ListGroup>
                  <Post
                    key={post.id}
                    isPreview
                    isOnSubapertivoPage
                    id={post.id}
                    title={post.title}
                    voteCount={post.voteCount}
                    commentCount={post.commentsAggregate?.count}
                    subapertivoName={subaperitivo.name}
                    userName={post.user.userName}
                  />
                </ListGroup>
              ))
            ) : (
              <p>No posts yet!</p>
            )}
          </>
        )}
    </Container>
  );
};
