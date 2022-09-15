import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "2",
  },
  {
    id: "2",
    text: "second",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstname: "Seol",
    username: "Heeseok",
  },
  {
    id: "2",
    firstname: "Elon",
    username: "Musk",
  },
];

const typeDefs = gql`
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet!
    allUsers: [User!]!
  }
  type Mutation {
    postTweet(text: String!, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type User {
    id: ID!
    firstname: String!
    username: String!
    fullname: String!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(_, args) {
      const data = tweets.find((tweet) => tweet.id === args.id);
      return data;
    },
    allUsers() {
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text }) {
      const newTweet = {
        id: tweets.length,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullname(root) {
      return `${root.firstname} ${root.username}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log("\x1b[36m%s\x1b[0m", `Running on ${url}`);
});
