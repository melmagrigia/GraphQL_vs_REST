import React from "react";
import Subaperitivo from "../components/Subaperitivo";
import { User } from "../components/User";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { Container, ListGroup } from "react-bootstrap";

export const HomePage = () => {

  return (
    <Container className="p-3">
      <p>
        Welcome to Aperitivo, a community of bookworms discussing their favorite
        books! Find a subaperitivo to browse or a user to follow below.
      </p>
      <h2>Popular Subaperitivos</h2>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && (
        <ListGroup>
          {data.querySubaperitivo.map((subaperitivo) => (
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
          {data.queryUser.map((user) => (
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
