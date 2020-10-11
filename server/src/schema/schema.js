const graphql = require('graphql')
var _ = require('lodash')
const User = require('../models/user')
const Hobby = require('../models/hobby')
const Post = require('../models/post')

const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent) {
        return Post.find({ userId: parent.id })
      }
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent) {
        return Hobby.find({ userId: parent.id })
      }
    }
  })
})

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby Description',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId)
      }
    }
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post Description',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Documentation for root...',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },

      resolve(_, args) {
        return User.findById(args.id)
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find()
      }
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(_, args) {
        return Hobby.findById(args.id)
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve() {
        return Hobby.find()
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(_, args) {
        return Post.findById(args.id)
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve() {
        return Post.find()
      }
    }
  }
})

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString }
      },
      resolve(_, args) {
        let user = new User({
          ...args
        })
        return user.save()
      }
    },
    UpdateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString }
      },
      resolve(_, args) {
        return updatedUser = User.findByIdAndUpdate(args.id, {
          $set: {
            ...args
          }
        }, {
          new: true,
          useFindAndModify: false
        })
      }
    },
    RemoveUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, args) {
        let removedUser = User.findByIdAndRemove(args.id, { useFindAndModify: false }).exec()
        if (!removedUser) {
          throw new Error("Failed to remove user")
        }
        return removedUser
      }
    },
    CreatePost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        let post = new Post({
          ...args
        })
        return post.save()
      }
    },
    UpdatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        return updatedPost = Post.findByIdAndUpdate(args.id, {
          $set: {
            ...args
          }
        }, {
          new: true,
          useFindAndModify: false
        })
      }
    },
    RemovePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, args) {
        let removedPost = Post.findByIdAndRemove(args.id, { useFindAndModify: false }).exec()
        if (!removedPost) {
          throw new Error("Failed to remove post")
        }
        return removedPost
      }
    },
    CreateHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        let hobby = new Hobby({
          ...args
        })
        return hobby.save()
      }
    },
    UpdateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        return updatedHobby = Hobby.findByIdAndUpdate(args.id, {
          $set: {
            ...args
          }
        }, {
          new: true,
          useFindAndModify: false
        })
      }
    },
    RemoveHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id, { useFindAndModify: false }).exec()
        if (!removedHobby) {
          throw new Error("Failed to remove hobby")
        }
        return removedHobby
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})