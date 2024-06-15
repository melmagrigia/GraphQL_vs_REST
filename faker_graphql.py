import random
import uuid
from faker import Faker
from random_username.generate import generate_username

fake = Faker()

# Number of entries to generate
NUM_USERS = 10000
NUM_SUBAPERITIVOS = 5000
NUM_POSTS = 20000
NUM_COMMENTS = 50000

# Generate Users
users = []
for _ in range(NUM_USERS):
    user = {
        "id": str(uuid.uuid4()),
        "userName": generate_username(1)[0],
        "bio": fake.text(max_nb_chars=200).replace('\n', ' ')
    }
    users.append(user)

# Generate Subaperitivos
subaperitivos = []
for _ in range(NUM_SUBAPERITIVOS):
    subaperitivo = {
        "id": str(uuid.uuid4()),
        "name": generate_username(1)[0],
        "description": fake.text(max_nb_chars=200).replace('\n', ' ')
    }
    subaperitivos.append(subaperitivo)

# Generate Posts
posts = []
for _ in range(NUM_POSTS):
    post = {
        "id": str(uuid.uuid4()),
        "title": fake.sentence(nb_words=6),
        "voteCount": random.randint(0, 1000),
        "user": random.choice(users)['id'],
        "subaperitivo": random.choice(subaperitivos)['id']
    }
    posts.append(post)

# Generate Comments
comments = []
for _ in range(NUM_COMMENTS):
    comment = {
        "id": str(uuid.uuid4()),
        "commentContent": fake.text(max_nb_chars=200).replace('\n', ' '),
        "voteCount": random.randint(0, 1000),
        "user": random.choice(users)['id'],
        "post": random.choice(posts)['id']
    }
    comments.append(comment)

# Output GraphQL Mutation
print('mutation {')
for user in users:
    print(f'  addUser(input: [{{ id: "{user["id"]}", userName: "{user["userName"]}", bio: "{user["bio"]}" }}]) {{ numUids }}')
for subaperitivo in subaperitivos:
    print(f'  addSubaperitivo(input: [{{ id: "{subaperitivo["id"]}", name: "{subaperitivo["name"]}", description: "{subaperitivo["description"]}" }}]) {{ numUids }}')
for post in posts:
    print(f'  addPost(input: [{{ id: "{post["id"]}", title: "{post["title"]}", voteCount: {post["voteCount"]}, user: {{ id: "{post["user"]}" }}, subaperitivo: {{ id: "{post["subaperitivo"]}" }} }}]) {{ numUids }}')
for comment in comments:
    print(f'  addComment(input: [{{ id: "{comment["id"]}", commentContent: "{comment["commentContent"]}", voteCount: {comment["voteCount"]}, user: {{ id: "{comment["user"]}" }}, post: {{ id: "{comment["post"]}" }} }}]) {{ numUids }}')
print('}')
