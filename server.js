const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const path = require("path");

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

if (process.env.NODE_ENV === "production") {
  // Set Static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

mongoose.connection.once("open", () => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
