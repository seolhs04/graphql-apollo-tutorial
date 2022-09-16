import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

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
    allMovies: [Movie!]!
    movie(id: String!): Movie
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
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String!
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
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
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
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
