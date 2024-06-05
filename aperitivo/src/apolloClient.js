import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://nameless-brook-540039.eu-central-1.aws.cloud.dgraph.io/graphql",
  cache: new InMemoryCache(),
});
