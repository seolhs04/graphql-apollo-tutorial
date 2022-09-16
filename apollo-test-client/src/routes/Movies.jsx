import { useApolloClient, gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ALL_MOVIES = gql`
  {
    allMovies {
      id
      title
    }
  }
`;

const Movies = () => {
  const { data, loading, error } = useQuery(ALL_MOVIES);

  if (loading) {
    return <h1>loading...</h1>;
  }
  if (error) {
    return <h1>error!!</h1>;
  }

  return (
    <>
      {data?.allMovies.map((movie) => (
        <li key={movie.id}>
          <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
        </li>
      ))}
    </>
  );
};

export default Movies;
