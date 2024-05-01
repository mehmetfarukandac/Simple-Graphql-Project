import React, { useState } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client'



const QUERY_ALL_USERS = gql`
        query GetAllUsers {
            users {
              id
              name
              username
              age
              nationality
              friends {
                id
                name
                username
                age
                nationality
              }
              favoriteMovies{
                name
                yearOfPublication
              }
            }
          }
`
const QUERY_ALL_MOVIES = gql`
       query GetAllMovies{
              movies {
                id
                name 
                yearOfPublication
                isInTheaters
              }
            }

`
const GET_MOVIE_BYNAME = gql`
    query Movie($name:String!){
            movie(name:$name){
                name
                yearOfPublication
                isInTheaters
            }        
        }
`

const DisplayData = () => {
    const [movieSearched, setMovieSearched] = useState("");

    const { data, loading, error } = useQuery(QUERY_ALL_USERS)
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES)
    const [fetchMovie, { data: movieSearchedData, error: movieError }] = useLazyQuery(GET_MOVIE_BYNAME);

    if (loading) {
        console.log("Loading...");
    }
    if (data) {
        console.log(data);
    }
    if (error) {
        console.log(error);
    }
    if (movieSearched) {
        console.log(movieSearched);
    }
    if (movieError) {
        console.log(movieError);
    }

    return (<div>
        <h1>Users</h1>
        {
            data && data.users.map((user, index) => (
                <div key={index}>
                    <h5>Name: {user.name}</h5>
                    <h5>Username: {user.username}</h5>
                    <h5>Age: {user.age}</h5>
                    <h5>Nationality: {user.nationality}</h5>
                </div>
            ))
        }
        <h1>Movies</h1>
        {
            movieData && movieData.movies.map((movie, index) => (
                <div key={index}>
                    <h5>Name: {movie.name}</h5>
                </div>
            ))
        }

        <div>
            <input type={"text"} placeholder="Interstellar..." onChange={(event) => setMovieSearched(event.target.value)} />
            <button onClick={() => {
                fetchMovie({
                    variables: {
                        name: movieSearched
                    }
                })
            }}>Fetch Data</button>
            <div>
                {
                    movieSearchedData && (
                        <div>
                            {""}
                            <h3>Name: {movieSearchedData.movie.name}</h3>
                            <h3>Year Of Publication: {movieSearchedData.movie.yearOfPublication}</h3>
                            {""}
                        </div>
                    )
                }
                {
                    movieError && <h1>There was an Error while Fetching the data!</h1>
                }
            </div>
        </div>
    </div>);
};
export default DisplayData;
