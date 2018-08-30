import Express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeRemoteExecutableSchema, makeExecutableSchema, mergeSchemas, introspectSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';

const HASURA_GRAPHQL_API_URL = process.env.HASURA_GRAPHQL_ENGINE_URL + '/v1alpha1/graphql';
const PORT = process.env.PORT ? process.env.PORT : 9000;

async function run() {

  const createRemoteSchema = async (uri) => {
    const link = new HttpLink({uri: uri, fetch});
    const schema = await introspectSchema(link);
    return makeRemoteExecutableSchema({
      schema,
      link,
    });
  };

  const executableHasuraSchema = await createRemoteSchema(HASURA_GRAPHQL_API_URL);

  const typeDefs = `
    type Query {
      hello: String
    }
  `;

  const resolvers = {
    Query: {
      hello: (root, args, context) => {
        return 'Hello world!';
      },
    },
  };

  const executableHelloSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const finalSchema = mergeSchemas({
    schemas: [
      executableHelloSchema,
      executableHasuraSchema,
    ]
  });

  const app = new Express();

  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: finalSchema}));

  app.use('/graphiql',graphiqlExpress({endpointURL: '/graphql'}));

  app.listen(PORT);
  console.log('Server running. Open http://localhost:' + PORT + '/graphiql to run queries.');
} // end of async run

try {
  run();
} catch (e) {
  console.log(e, e.message, e.stack);
}
