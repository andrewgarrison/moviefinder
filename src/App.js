import React, { Component } from 'react';
import { Switch, Link, HashRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types'
import Genres from './genres.js';
import BackArrow from './arrow-left.svg';
import PlayIcon from './play-circle.svg';
import './App.less';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  render() {
    return (
      <div className='container'>
        <div className='c-search'>
          <input type="text" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} className='c-search__input' placeholder='Search for Movies'></input>
          <Link className='c-search__submit c-btn c-primary-btn' to={`/search/${this.state.inputValue}`} replace>Find Movie</Link>
        </div>
      </div>
    );
  }
}

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

class MovieCard extends Component {
  trim(text) {
    let textLength = text.length;
    let trimmedOverview = text.substring(0, 15);

    if (textLength > 15) {
      return trimmedOverview + '...';
    } 

    return text;
  }

  render() {
    return (
      <div className='c-result'>
        <div className='c-result__image'>
          <img src={this.props.poster} alt={this.props.name}/>
        </div>
        <div className='c-result__info'>
          <h2 className='c-result__title'>{this.trim(this.props.name)} ({this.props.release_year.substring(0, 4)})</h2>
          <span className='c-result__genres'>{this.props.genres}</span>
        </div>
      </div>
    );
  }
}

class MoviePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieResponse: [],
      movieBackdrop: '',
      movieTrailer: ''
    };
  }

  componentDidMount() {
    fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.number}?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US`)
    .then(results => {
      return results.json();
    }).then(data => {
        // store tmdb backdrop
        this.setState({movieBackdrop: 'https://image.tmdb.org/t/p/original' + data.backdrop_path})

        // Make a subsequent request to imdb to get improved movie data
        fetch('https://www.omdbapi.com/?i=' + data.imdb_id + '&apikey=dbbd0a02')
        .then(imdb_results => {
          return imdb_results.json();
        }).then(imdb_data => {
          this.setState({movieResponse: imdb_data})
        });
    })

    // get movie trailer link
    fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.number}/videos?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US`)
    .then(results => {
      return results.json();
    }).then(data => {
      // store trailer link
      if (data.results.length) {
        for (let i = 0; i < data.results.length; i++) {
          if (data.results[i].type === 'Trailer') {
            this.setState({movieTrailer: data.results[0].key});
            break;
          }
        }
      }
    });
  }

  render() {
    return (
      <div className='single-movie-page' style={{backgroundImage: `linear-gradient(rgba(63, 65, 72, 0.75), rgba(63, 65, 72, 0.75)), url(${this.state.movieBackdrop})`}}>
        <BackButton/>
        <div className='container c-movie'>
          <div className='c-movie__info'>
            <h1 className='c-movie__title'>{this.state.movieResponse.Title} <span className='c-movie__year'>({this.state.movieResponse.Year})</span></h1>
            <ul className='c-movie__genre'>
              <li><strong>{this.state.movieResponse.Rated}</strong></li>
              <li>{this.state.movieResponse.Runtime}</li>
              <li>{this.state.movieResponse.Genre}</li>
            </ul>
            <p className='c-movie__plot'>{this.state.movieResponse.Plot}</p>
            <p><strong>Starring:</strong> {this.state.movieResponse.Actors}</p>
            <a href={`https://www.imdb.com/title/${this.state.movieResponse.imdbID}`}><h3 className='c-movie__rating'>{this.state.movieResponse.imdbRating}<span className='out-of-ten'>/10</span></h3></a>
            {this.state.movieTrailer !== '' &&
              <a href={`https://www.youtube.com/watch?v=${this.state.movieTrailer}`} className='c-btn c-secondary-btn'>
                <div className='flex flex--center'>
                  <div>Watch Trailer</div> 
                  <div><img src={PlayIcon} alt='Play Icon' className='c-play-icon'/></div>
                </div>
              </a>
            }
          </div>
          <div className='c-movie__poster'>
            <img src={this.state.movieResponse.Poster} alt={this.state.movieResponse.Title}/>
          </div>
        </div>
      </div>
    );
  }
}

class BackButton extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    return (
      <img src={BackArrow} alt="Back Arrow" className='c-arrow--back' onClick={this.context.router.history.goBack}/>
    );
  }
}

class Main extends Component {
  render() {
    return (
      <div className='movie-app'>
        <Switch>
          <Route exact path='/' component={Search}/>
          <Route exact path='/search' component={Search}/>
          <Route path='/search/:term' component={SearchResults}/>
          <Route path='/item/:number' component={MoviePage}/>
        </Switch>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Main/>
      </HashRouter>
    );
  }
}

export default App;
