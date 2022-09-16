import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_MOVIE = gql`
  query ($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      isLiked @client
    }
  }
`;

const Movie = () => {
  const { id } = useParams();
  const {
    data,
    loading,
    error,
    client: { cache },
  } = useQuery(GET_MOVIE, {
    variables: {
      movieId: id,
    },
  });

  const onClick = () => {
    cache.writeFragment({
      id: `Movie:${id}`,
      fragment: gql`
        fragment MovieFragment on Movie {
          isLiked
        }
      `,
      data: {
        isLiked: !data.movie.isLiked,
      },
    });
  };

  if (loading) {
    return <h1>loading...</h1>;
  }
  if (error) {
    return <h1>error!!</h1>;
  }
  return (
    <div>
      <button onClick={onClick}>
        {data?.movie.isLiked ? "Unlike" : "Like"}
      </button>
      <h1>{data?.movie?.title}</h1>
    </div>
  );
};

export default Movie;
