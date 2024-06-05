import { Card } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const Subaperitivo = ({ title, description, isPreview }) => {
  return (
    <ListGroup.Item>
      <Card>
        {isPreview && (
          <Link to={`/subaperitivo/${title}`}>
            <Card.Title>{title}</Card.Title>
          </Link>
        )}
        {!isPreview && <Card.Title>{title}</Card.Title>}
        <Card.Body>{description}</Card.Body>
      </Card>
    </ListGroup.Item>
  );
};

export default Subaperitivo;
