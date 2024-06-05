CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT
);

CREATE TABLE Subaperitivos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    userId INTEGER NOT NULL,
    subaperitivoId INTEGER NOT NULL,
    voteCount INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (subaperitivoId) REFERENCES Subaperitivos(id)
);

CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    commentContent TEXT NOT NULL,
    userId INTEGER NOT NULL,
    postId INTEGER NOT NULL,
    voteCount INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (postId) REFERENCES Posts(id)
);
