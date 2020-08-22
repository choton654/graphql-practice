const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const axios = require('axios');
const { default: Axios } = require('axios');

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLString),
    },
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (parent, args) => {
        const { data } = await Axios.get(
          `http://localhost:3000/companies/${parent.id}/users`,
        );
        return data;
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLString),
    },
    name: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
    company: {
      type: CompanyType,
      resolve: async (parent, args) => {
        const { data } = await Axios.get(
          ` http://localhost:3000/companies/${parent.companyId}`,
        );
        return data;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (parent, args) => {
        const { data } = await axios.get(
          `http://localhost:3000/users/${args.id}`,
        );
        return data;
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args) => {
        const { data } = await axios.get(
          `http://localhost:3000/companies/${args.id}`,
        );
        return data;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        const { data } = await Axios.get('http://localhost:3000/users');
        return data;
      },
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve: async () => {
        const { data } = await Axios.get('http://localhost:3000/companies');
        return data;
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
