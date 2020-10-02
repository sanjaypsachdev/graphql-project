const graphql = require('graphql')
var _ = require('lodash')

const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql

// Dummy data
var users = [
  { id: '1', name: '1Sanjay', age:11, profession: 'Student' },
  { id: '2', name: '2Sanjay', age:21, profession: 'Engineer' },
  { id: '3', name: '3Sanjay', age:31, profession: 'Programmer' },
  { id: '4', name: '4Sanjay', age:41, profession: 'Tech Lead' },
  { id: '5', name: '5Sanjay', age:51, profession: 'Software Architect' }
]

var hobbies = [
  { id: '1', title: 'Programming', description: 'Programming Desc', userId: '1'  },
  { id: '2', title: 'Photography', description: 'Photography Desc', userId: '2'  },
  { id: '3', title: 'Rowing', description: 'Rowing Desc', userId: '2'  },
  { id: '4', title: 'Mountain Climbing', description: 'Mountain Climbing Desc', userId: '5'  },
  { id: '5', title: 'Skating', description: 'Skating Desc', userId: '3'  }
]

var posts = [
  { id: '1', comment: 'Post1', userId: '1' },
  { id: '2', comment: 'Post2', userId: '1' },
  { id: '3', comment: 'Post3', userId: '2' },
  { id: '4', comment: 'Post4', userId: '4' },
  { id: '5', comment: 'Post5', userId: '2' }
]

const User = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(Post),
      resolve(parent, args) {
        return _.filter(posts, { userId: parent.id })
      }
    },

    hobbies: {
      type: new GraphQLList(Hobby),
      resolve(parent, args) {
        return _.filter(hobbies, { userId: parent.id })
      }
    }
  })
})

const Hobby = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby Description',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: User,
      resolve(parent, args) {
        return _.find(users, { id: parent.userId })
      }
    }
  })
})

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Post Description',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: User,
      resolve(parent, args) {
        return _.find(users, { id: parent.userId })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Documentation for root...',
  fields: {
    user: {
      type: User,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(users, { id: args.id })
      }
    },
    hobby: {
      type: Hobby,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(hobbies, { id: args.id })
      }
    },
    post: {
      type: Post,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(posts, { id: args.id })
      }
    }
  }
})

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    CreateUser: {
      type: User,
      args: {
        // id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { name, age, profession } = args
        const user = { name, age, profession }
        return user
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})