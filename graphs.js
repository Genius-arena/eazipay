// const express = require('express');
// // const expressGraphQL = require('express-graphql');
// const { graphqlHTTP } = require('express-graphql');
// const {
//   GraphQLSchema,
//   GraphQLObjectType,
//   GraphQLString,
// } = require('graphql');

// const app = express();

// const schema = new GraphQLSchema ({
//     query: new GraphQLObjectType ({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: () => 'Hello World'
//             }
//         })
//     })
// })

// app.use('/graphql',  expressGraphQL({
//     // schema: schema,
//     graphiql: true
// }));

// app.use(
//     '/graphql',
//     graphqlHTTP({
//       schema: schema,
//       graphiql: true,
//     }),
//   );

// app.listen(5000, () => console.log('Server Running')); 






const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Bookor = require('./models/book');
// const expressGraphQL = require('express-graphql')
const { graphqlHTTP }= require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const app = express(); 

// const authors = [
// 	{ id: 1, name: 'J. K. Rowling' },
// 	{ id: 2, name: 'J. R. R. Tolkien' },
// 	{ id: 3, name: 'Brent Weeks' }
// ]

// const books = [
// 	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
// 	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
// 	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
// 	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
// 	{ id: 5, name: 'The Two Towers', authorId: 2 },
// 	{ id: 6, name: 'The Return of the King', authorId: 2 },
// 	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
// 	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }


// const BookType = new GraphQLObjectType({
//   name: 'Book',
//   description: 'This represents a book written by an author',
//   fields: () => ({
//     id: { type: GraphQLNonNull(GraphQLInt) },
//     name: { type: GraphQLNonNull(GraphQLString) },
//     authorId: { type: GraphQLNonNull(GraphQLInt) },
//     author: {
//       type: AuthorType,
//       resolve: (book) => {
//         return authors.find(author => author.id === book.authorId)
//       }
//     }
//   })
// })

// const AuthorType = new GraphQLObjectType({
//   name: 'Author',
//   description: 'This represents a author of a book',
//   fields: () => ({
//     id: { type: GraphQLNonNull(GraphQLInt) },
//     name: { type: GraphQLNonNull(GraphQLString) },
//     books: {
//       type: new GraphQLList(BookType),
//       resolve: (author) => {
//         return books.filter(book => book.authorId === author.id)
//       }
//     }
//   })
// })

const luxType = new GraphQLObjectType({
  name: 'Booky',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    author: { type: GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLNonNull(GraphQLString) },
    // resolve: () => {
    //     return Bookor.find({});
    // }
    book: {
      type: luxType,
      resolve: (book) => {
        // return authors.find(author => author.id === book.authorId)
        return Bookor.find({});
    }
  }
  })
})



const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: luxType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) =>{ 
        Bookor.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(luxType),
      description: 'List of All Books',
      resolve: () =>  {
        Bookor.find()
      }
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: luxType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        author: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const book = { name: args.name, author: args.author, genre: args.genre }
        Bookor.create(book)
        return book;
      }
    },
    updateBook: {
      type: luxType,
      description: 'Update a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        author: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const bookUpdate = { name: args.id, author: args.author, genre: args.genre }
        const updatedBook = Bookor.findByIdAndUpdate(id, bookUpdate, {new:true})
        return updatedBook
      }
    },
    deleteBook: {
      type: luxType,
      description: 'delete a book',
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: args.id}
        Bookor.findByIdAndDelete(id)
        return
      }
    },
    // addAuthor: {
    //   type: AuthorType,
    //   description: 'Add an author',
    //   args: {
    //     name: { type: GraphQLNonNull(GraphQLString) }
    //   },
    //   resolve: (parent, args) => {
    //     const author = { id: authors.length + 1, name: args.name }
    //     authors.push(author)
    //     return author
    //   }
    // }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})


app.use('/graphql',  graphqlHTTP({
  schema: schema,
  graphiql: true
}))


// const DB = process.env.DATABASE_LOCAL
const DB = 'mongodb://localhost:27017/graphTest'
// eslint-disable-next-line no-use-before-define
main().catch();
// main().catch(err => console.log(err));

// eslint-disable-next-line node/no-unsupported-features/es-syntax
async function main() {
  await mongoose.connect(DB).then(() => {
    console.log('DB coonnection successful');
  });
}

app.listen(5000, () => console.log('Server Running'))
