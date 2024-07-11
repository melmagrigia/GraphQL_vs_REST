# Rapid Application Development with GraphQL and Dgraph DB
Project for the course of Data Management at Sapienza University

## REST vs GraphQL
The same social app (Reddit like) developed twice: ones with a REST tech stack, express server plus PG DB and ones with GraphQL and Dgraph DB.

This repo contains the two Aperitivo Social apps and also scripts to populate the databases with custom data.

To run make sure you have docker compose, docker, node and yarn installed. 

Each database run a inside docker container:

```bash
docker compose up -d
```

to start the aperitivo Rest app inside the aperitivo_REST directory:

```bash
npm install
npm start
```

to start the Express Server inside the express_server directory:

```bash
npm install
node server.js
```

to start the aperitivo (with Apollo Client) app inside the aperitivo directory:

```bash
yarn init
yarn start
```

to seed the PG database inside the express_server directory:

```bash
node seed.js
```

to seed the Dgraph database, create a python venv with the requirements.txt, then from inside the aperitivo/dataset directory create the schema:

```bash
curl -H "Content-Type: application/graphql" -X POST localhost:8080/admin/schema --data-binary @schema.graphql
```

then with the venv activated:

```bash
python3 faker_graphql.py > data.graphql

curl -H "Content-Type: application/graphql" -X POST localhost:8080/graphql --data-binary @data.graphql
```