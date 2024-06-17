import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from "@apollo/client";

const logExtensionsLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    if (response.extensions.tracing.duration) {
      console.log('Extensions:', response.extensions.tracing.duration / 1_000_000);
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
  cache: new InMemoryCache(),
}); 
