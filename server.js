const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

// Create MongoDB models
const Todo = mongoose.model("Todo", {
  text: String,
  complete: Boolean
});

// Graphql schema
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
    updateTodo(id: ID!, complete: Boolean!): Boolean
    removeTodo(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    todos: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({ text, complete: false });
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, complete }) => {
      await Todo.findOneAndUpdate({ _id: id }, { complete });
      return true;
    },
    removeTodo: async (_, { id }) => {
      await Todo.findOneAndDelete(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

mongoose.connection.once("open", () => {
  server.start(() => console.log("Server is running on port 4000"));
});
