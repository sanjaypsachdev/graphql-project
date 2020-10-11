const graphql = require('graphql')

const {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql

//Scalar types

const Address = new GraphQLObjectType({
  name: 'Address',
  description: 'Address',
  fields: () => ({
    id: { type: GraphQLID },
    address1: { type: GraphQLString },
    address2: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLInt }
  })
})

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'Represents a Person',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    isMarried: { type: GraphQLBoolean },
    gpa: { type: GraphQLFloat },
    homeAddress: { 
      type: Address,
      resolve() {
        return {
          address1: 'address1',
          address2: 'address2',
          city: 'city',
          state: 'state',
          zip: 'zip'
        }
      }
    },
    officeAddress: { 
      type: Address,
      resolve() {
        return {
          address1: 'officeAddress1',
          address2: 'officeAddress2',
          city: 'city',
          state: 'state',
          zip: 'zip'
        }
      }
    },
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Documentation for root...',
  fields: {
    person: {
      type: Person,
      resolve() {
        return {
          name: 'Sanjay',
          age: 8,
          isMarried: false,
          gpa: '4.0'
        }
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})