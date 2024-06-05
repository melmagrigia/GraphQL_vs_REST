import { Card } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Post = ({
  id,
  title,
  voteCount,
  commentCount,
  subaperitivoName,
  userName,
  isPreview,
  isOnUserPage,
  isOnSubapertivoPage,
}) => {
  return (
    <ListGroup.Item>
      <Card>
        {isOnSubapertivoPage && <Card.Header>Posted by {userName}</Card.Header>}
        {isOnUserPage && (
          <Card.Header>Posted in {subaperitivoName}</Card.Header>
        )}
        {!isOnUserPage && !isOnSubapertivoPage && (
          <Card.Header>
            Posted by {userName} | in {subaperitivoName}
          </Card.Header>
        )}

        {isPreview && (
          <Link to={`/post/${id}`}>
            <Card.Title>{title}</Card.Title>
          </Link>
        )}
        {!isPreview && <Card.Title>{title}</Card.Title>}
        <Card.Footer>
          {voteCount} Votes |{commentCount} Comments
        </Card.Footer>
      </Card>
    </ListGroup.Item>
  );
};
