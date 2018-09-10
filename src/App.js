import React, { Component } from 'react';
import { Switch, Link, HashRouter, Route, BrowserRouter as Router } from 'react-router-dom';
import queryString from 'query-string';
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
      let movies = data.results.map((movie) => {
        console.log(movie);
        let posterPath = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/' + movie.poster_path;
        return (
            <Link key={movie.id} to={`/movie/id=${movie.id}`}>
              <MovieCard name={movie.original_title} overview={movie.overview} poster={posterPath} rating={movie.vote_average}/>
            </Link>
        )
      });
      this.setState({movieResponse: movies})
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

class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieResponse: []
    };
  }

  getQueryString() {
    const url = window.location.href;
    let id = url.substring(url.indexOf("=") + 1, url.length);
    return id;
  }

  componentDidMount() {
    fetch('https://api.themoviedb.org/3/movie/' + this.getQueryString() + '?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US')
    .then(results => {
      console.log(results);
      return results.json();
    }).then(data => {
        this.setState({movieResponse: data})
      });
  }

  getPosterPath() {
    let baseUrl = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';
    return baseUrl + this.state.movieResponse.poster_path;
  }

  render() {
    return (
      <div className='single-movie-page'>
        <h1>{this.state.movieResponse.original_title}</h1>
        <img src={this.getPosterPath()} alt={this.state.movieResponse.original_title}/>
        <p>{this.state.movieResponse.overview}</p>
      </div>
    );
  }
}

class MovieCard extends Component {
  trim(text) {
    let textLength = text.length;
    let trimmedOverview = text.substring(0, 150);

    if (textLength > 150) {
      return trimmedOverview + '...';
    } 

    return text;
  }

  render() {
    return (
      <div className='c-result'>
        <img src={this.props.poster} alt={this.props.name}/>
        <h2>{this.props.name}</h2>
        <span>{this.props.rating}</span>
        <p>{this.trim(this.props.overview)}</p>
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
          <Route path='/movie/id=:number' component={Movie}/>
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
