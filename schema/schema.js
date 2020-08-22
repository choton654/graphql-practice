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
    user: {
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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve: (_, { name, age }) => {
        return axios
          .post('http://localhost:3000/users', { name, age })
          .then((res) => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve: (_, { id }) => {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((res) => console.log('user deleted'));
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyid: { type: GraphQLString },
      },
      resolve: (_, { id, name, age }) => {
        return axios
          .patch(`http://localhost:3000/users/${id}`, { name, age })
          .then((res) => res.data);
      },
    },
  },
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
  mutation,
});
