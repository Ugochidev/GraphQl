const express = require("express");
const expressGraphql = require("express-graphql").graphqlHTTP;
const app = express();
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const authors = [
  { id: 1, name: "j. k. Rowling" },
  { id: 2, name: "j. R. R. Tolkion" },
  { id: 3, name: "Brent weeks" },
];

const books = [
  { id: 1, name: "Harry potter and the chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry potter and the prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The two Towers", authorId: 2 },
  { id: 6, name: "The return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];
// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "helloworld",
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => "Hello world",
//       },
//     }),
//   }),
// });

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
        type: AuthorType,
        resolve: (book) => {
         return authors.find(author => author.id === book.authorId)
        }
    }
  }),
});
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents a author  a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
        type: new GraphQLList(BookType),
        resolve: (author) => {
            return  books.filter(book => book.authorId === author.id)
        }
    }
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => auhors,
    },
    author: {
      type: AuthorType,
      description: "A single Author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    // const RootMutationType = new GraphQLObjectType({
    //   name: "Mutation",
    //   description: "Root Mutation",
    //   fields: () => ({
    //     addBook: {
    //       type: BookType,
    //       description: "Add a book",
    //       args: {
    //         name: {
    //           type: GraphQLNonNull(GraphQLString),
    //         },
    //         authorId: {
    //           type: GraphQLNonNull(GraphQLString),
    //         },
    //         resolve: (parent, args) => {
    //           const book = {
    //             id: books.length + 1,
    //             name: args.name,
    //             authorId: args.authorId,
    //           };
    //           books.push(book);
    //           return book;
    //         },
    //       },
    //     },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        resolve: (parent, args) => {
          const author = {
            id: authors.length + 1,
            name: args.name,
          };
          authors.push(author);
          return author;
        },
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

app.use(
  "/graphql",
  expressGraphql({
    schema: schema,
    graphiql: true,
  })
);
app.listen(2000, () => console.log("server is up and running"));
