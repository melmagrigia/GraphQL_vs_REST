import React, {useEffect, useState} from "react";
import Subaperitivo from "../components/Subaperitivo";
import { User } from "../components/User";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { Container, ListGroup } from "react-bootstrap";
import axios from 'axios';

export const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/`);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  });

  return (
    <Container className="p-3">
      <p>
        Welcome to Aperitivo, a community of alcoholics discussing their favorite
        drinks! Find a subaperitivo to browse or a user to follow below.
      </p>
      <h2>Popular Subaperitivos</h2>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && (
        <ListGroup>
          {data.subaperitivos.map((subaperitivo) => (
            <Subaperitivo
              key={subaperitivo.name}
              isPreview
              title={subaperitivo.name}
              description={subaperitivo.description}
            />
          ))}
        </ListGroup>
      )}
      <h2>Popular Users</h2>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage />}
      {data && (
        <ListGroup>
          {data.users.map((user) => (
            <User
              key={user.userName}
              isPreview
              userName={user.userName}
              bio={user.bio}
              postCount={user.postsAggregate?.count}
              commentCount={user.commentsAggregate?.count}
            />
          ))}
        </ListGroup>
      )}
    </Container>
  );
};
