import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';
import { FaHeart } from "react-icons/fa";


const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);



  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list',
        {
          params: {
            api_key: 'eca5506b37afb195d330f0dd78e39b69',
          },
        }
      );
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);



  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        {
          params: {
            api_key: 'eca5506b37afb195d330f0dd78e39b69',
            sort_by: sortBy,
            page: 1,
            with_genres: selectedGenre,
            query: searchQuery,
          },
        }
      );
      setMovies(response.data.results);
    };
    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre]);



  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSearchSubmit = async () => {
    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        params: {
          api_key: 'eca5506b37afb195d330f0dd78e39b69',
          query: searchQuery,
        },
      }
    );
    setMovies(response.data.results);
  };

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  const addToFavorites = (movie) => {
    const exists = favorites.find((fav) => fav.id === movie.id);

    if (!exists) {
      setFavorites([...favorites, movie]);
      setToastMessage(`"${movie.title}" added to favorites ❤️`);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } else {
      setToastMessage(`"${movie.title}" already in favorites ⚠️`);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter((movie) => movie.id !== id));
  };



  return (
    <div>
      {/* ===== TOP INFO BAR ===== */}
      <div className="top-bar">
        <div className="top-left">
          <span className="logo-text">MovieHouse</span>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <div className="main-navbar">
        <div className="filters-bar">
          <div className="filter-item">
            <span>Sort By</span>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="popularity.desc">Popularity ↓</option>
              <option value="popularity.asc">Popularity ↑</option>
              <option value="vote_average.desc">Rating ↓</option>
              <option value="vote_average.asc">Rating ↑</option>
              <option value="release_date.desc">Release Date ↓</option>
              <option value="release_date.asc">Release Date ↑</option>
            </select>
          </div>

          <div className="filter-item">
            <span>Genres</span>
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search movies..." value={searchQuery} onChange={handleSearchChange} className='search-input' />
          <button onClick={handleSearchSubmit} className="search-button">
            <AiOutlineSearch />
          </button>
        </div>
      </div>



      <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p className='rating'>Rating: {movie.vote_average}</p>
            {expandedMovieId === movie.id ? (
              <p>{movie.overview}</p>
            ) : (
              <p>{movie.overview.substring(0, 150)}...</p>
            )}
            <button onClick={() => toggleDescription(movie.id)} className='read-more'>
              {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
            </button>
            <button
              className="fav-btn"
              onClick={() => addToFavorites(movie)}
            >
              <FaHeart className='fav-icon' /> Add to Favorites
            </button>
          </div>
        ))}
      </div>

      <h2 className="fav-title"><FaHeart className='fav-icon' /> Favorite Movies</h2>

      <div className="movie-wrapper">
        {favorites.length === 0 && <p className='fav-p'>No favorites added</p>}

        {favorites.map((movie) => (
          <div key={movie.id} className="movie">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <p className="rating">Rating: {movie.vote_average}</p>

            <button
              className="remove-btn"
              onClick={() => removeFromFavorites(movie.id)}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}

    </div>
  );
};

export default MovieRecommendations;
