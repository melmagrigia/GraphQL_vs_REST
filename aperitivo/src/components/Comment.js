import { Card } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";

export const Comment = ({
  key,
  postTitle,
  postId,
  commentContent,
  voteCount,
  userName,
  isOnPostPage,
  isOnUserPage,
}) => {
  return (
    <ListGroup.Item>
      <Card>
        {isOnUserPage && <Card.Header>Commmented on {postTitle}</Card.Header>}
        {isOnPostPage && <Card.Header>Commmented by {userName}</Card.Header>}
        <Card.Body>{commentContent}</Card.Body>
        <Card.Footer>{voteCount} votes</Card.Footer>
      </Card>
    </ListGroup.Item>
  );
};
