import React from "react"

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Todo from "./Todo";


export const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

export default function App() {



  return (
    <ApolloProvider client={client}>
       <Todo />
    </ApolloProvider>
  
  );
}

