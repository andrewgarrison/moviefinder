import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SearchResults.less';
import Genres from './Genres';
import MovieCard from './MovieCard';
import Search from './Search';

class SearchResults extends Component {
    constructor(props) {
      super(props);
      this.state = {
        movieResponse: []
      };
    }
    
    _isMounted = false;
  
    componentDidMount() {
      this._isMounted = true;
      this.fetchSearchResults();
    }
  
    componentDidUpdate(prevProps) {
      let oldId = prevProps.match.params.term;
      let newId = this.props.match.params.term;
      if (newId !== oldId) {
        this.fetchSearchResults();
      }
    }
  
    componentWillUnmount() {
      this._isMounted = false;
    }
  
    fetchSearchResults() {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US&query=${this.props.match.params.term}`)
      .then(results => {
        return results.json();
      }).then(data => {
        if (data.results && data.results.length) {
          let movies = data.results.map((movie) => {
            // weed out some bad results
            if (movie.poster_path !== null && movie.release_date !== '' && movie.genre_ids.length !== 0) {
              let posterPath = 'https://image.tmdb.org/t/p/w342' + movie.poster_path;
              let genreList;
  
              // map through numerical genres and assign them a proper name
  
              // list first genre
              if (movie.genre_ids.length > 0) {
                genreList = Genres[movie.genre_ids[0]];
              }
  
              // list remaining genres with a comma
              for (let i = 1; i < movie.genre_ids.length; i++) {
                genreList += ', ' + Genres[movie.genre_ids[i]];
              }
  
              return (
                  <Link className='c-result__link' key={movie.id} to={`/item/${movie.id}`}>
                    <MovieCard poster={posterPath} name={movie.original_title} release_year={movie.release_date} genres={genreList}/>
                  </Link>
              )
            }
  
            // if no poster path return empty
            return '';
          });
  
          if (this._isMounted) {
            this.setState({movieResponse: movies});
          }
  
        } else {
          this.setState({movieResponse: `Sorry! We couldn't find a movie title matching "${this.props.match.params.term}". Please update your search and try again.`})
        }
      })
    }
  
    render() {
      return (
      <div>
        <Search/>
        <div className='c-results'>
          {this.state.movieResponse}
        </div>
      </div>
      );
    }
  }

  export default SearchResults;