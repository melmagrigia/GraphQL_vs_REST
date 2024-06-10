#!/bin/bash

# Wait for DGraph Alpha to be ready
echo "Waiting for DGraph Alpha to be ready..."
until curl -s localhost:8080/health | grep -q 'healthy'; do
  sleep 5
done

echo "DGraph Alpha is ready. Initializing schema and data..."

# Set the schema
schema_response=$(curl -H "Content-Type: application/graphql" -X POST localhost:8080/admin/schema --data-binary @schema.graphql)
echo "Schema response: $schema_response"

# # Import data
# data_response=$(curl -H "Content-Type: application/graphql" -X POST localhost:8080/graphql --data-binary @data.graphql)
# echo "Data response: $data_response"

echo "Initialization complete."
