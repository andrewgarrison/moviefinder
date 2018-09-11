import React, { Component } from 'react';
import { Switch, Link, HashRouter, Route } from 'react-router-dom';
import './App.less';

class MovieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      movieResponse: []
    };
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  getMovieResults() {
    fetch('https://api.themoviedb.org/3/search/movie?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US&query=' + this.state.inputValue)
    .then(results => {
      return results.json();
    }).then(data => {
      if (data.results && data.results.length > 0) {
        let movies = data.results.map((movie) => {
          let posterPath = 'https://image.tmdb.org/t/p/w342' + movie.poster_path;
          return (
              <Link className='c-result__link' key={movie.id} to={`/item/${movie.id}`}>
                <MovieCard name={movie.original_title} poster={posterPath} rating={movie.vote_average}/>
              </Link>
          )
        });
        this.setState({movieResponse: movies})
      } else {
        this.setState({movieResponse: `Sorry! We couldn't find a movie title matching "${this.state.inputValue}". Please update your search and try again.`})
      }
    })
  }

  render() {
    return (
      <div className='movie-search-results'>
        <div className='c-search'>
          <input type="text" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} className='c-search__input' placeholder='Search for Movies'></input>
          <button className='c-search__submit' onClick={() => this.getMovieResults()}>Find Movie</button>
        </div>
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
    let trimmedOverview = text.substring(0, 18);

    if (textLength > 18) {
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
          <h2 className='c-result__title'>{this.trim(this.props.name)}</h2>
          <span className='c-result__rating'>TMDb Rating: <strong>{this.props.rating}</strong></span>
        </div>
      </div>
    );
  }
}

class MoviePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieResponse: []
    };
  }

  getQueryString() {
    const url = window.location.href;
    let id = url.substring(url.indexOf("item") + 5, url.length);
    return id;
  }

  componentDidMount() {
    fetch('https://api.themoviedb.org/3/movie/' + this.getQueryString() + '?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US')
    .then(results => {
      return results.json();
    }).then(data => {
        // Make a subsequent request to imdb to get improved movie data
        fetch('http://www.omdbapi.com/?i=' + data.imdb_id + '&apikey=dbbd0a02')
        .then(imdb_results => {
          return imdb_results.json();
        }).then(imdb_data => {
          this.setState({movieResponse: imdb_data})
        });
    })
  }

  render() {
    return (
      <div className='single-movie-page'>
        <h1>{this.state.movieResponse.Title}</h1>
        <img src={this.state.movieResponse.Poster} alt={this.state.movieResponse.Title}/>
        <p>{this.state.movieResponse.Plot}</p>
      </div>
    );
  }
}

class Main extends Component {
  render() {
    return (
      <div className='container'>
        <Switch>
          <Route exact path='/' component={MovieSearch}/>
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
