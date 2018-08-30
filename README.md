# GraphQL Custom Resolver Example

A simple example of using a custom resolver with Hasura's GraphQL API. We combine Hasura GraphQL and a simple hello world schema by Schema Stitching.

Schema stitching is the process of creating a single GraphQL schema from multiple underlying GraphQL APIs.

Schema stitching allows you to have one unified API that allows the client to query multiple GraphQL Schemas at the same time, including relations between the schemas.

### Prerequisites

This demo requires Hasura's GraphQL Engine running with any schema.

### Usage

```
npm install
HASURA_GRAPHQL_ENGINE_URL=http://localhost:9000 npm start
```

Change the `HASURA_GRAPHQL_ENGINE_URL` environment variable to point to a hasura graphql-engine server. Then, open [localhost:8080/graphiql](http://localhost:8080/graphiql) in your web browser, and start exploring with your query.

### Merge Schemas
This demo combines two GraphQL schemas and exposes them on a single API:

1. The Hasura GraphQL API, with the schema
2. A simple hello world schema.

```graphql
# Get hello
query {
  hello
}

# Get data from Hasura Data API
query fetch_author {
  author {
    id
    name
  }
}
```

Now this can be merged and queried using the same API like:

```graphql

query {
    hello 
    author {
       id
       name
    }
}

```
