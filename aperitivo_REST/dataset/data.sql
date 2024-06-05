-- Insert sample users
INSERT INTO Users (userName, bio) VALUES ('alice', 'Alice bio');
INSERT INTO Users (userName, bio) VALUES ('bob', 'Bob bio');

-- Insert sample subaperitivos
INSERT INTO Subaperitivos (name, description) VALUES ('sub1', 'Subaperitivo 1 description');
INSERT INTO Subaperitivos (name, description) VALUES ('sub2', 'Subaperitivo 2 description');

-- Insert sample posts
INSERT INTO Posts (title, userId, subaperitivoId, voteCount) VALUES ('Post 1', 1, 1, 10);
INSERT INTO Posts (title, userId, subaperitivoId, voteCount) VALUES ('Post 2', 2, 2, 5);

-- Insert sample comments
INSERT INTO Comments (commentContent, userId, postId, voteCount) VALUES ('Comment 1 on Post 1', 1, 1, 3);
INSERT INTO Comments (commentContent, userId, postId, voteCount) VALUES ('Comment 2 on Post 2', 2, 2, 1);
