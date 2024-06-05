import { Card } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export const User = ({ userName, bio, postCount, commentCount, isPreview }) => {
  return (
    <ListGroup.Item>
      <Card>
        {isPreview && (
          <Link to={`/user/${userName}`}>
            <Card.Title>{userName}</Card.Title>
          </Link>
        )}
        {!isPreview && <Card.Title>{userName}</Card.Title>}
        <Card.Body>{bio}</Card.Body>
        <Card.Footer>
          {postCount} posts |{commentCount} comments
        </Card.Footer>
      </Card>
    </ListGroup.Item>
  );
};
