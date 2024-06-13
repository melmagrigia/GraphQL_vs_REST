import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from "@apollo/client";

const logExtensionsLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    if (response) {
      console.log('Extensions:', response);
    }
    return response;
  });
});

const httpLink = new HttpLink({
  uri: "http://localhost:8080/graphql",
});

// Combine the links
const link = from([logExtensionsLink, httpLink]);

export const apolloClient = new ApolloClient({
  link,
  // uri: "https://nameless-brook-540039.eu-central-1.aws.cloud.dgraph.io/graphql",
  cache: new InMemoryCache(),
}); 
