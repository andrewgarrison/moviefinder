import React, { Component } from 'react';
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
    fetch('https://api.themoviedb.org/3/search/movie?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US&query=' + this.state.inputValue + '&page=1&include_adult=false')
    .then(results => {
      return results.json();
    }).then(data => {
      let movies = data.results.map((movie) => {
        console.log(movie);
        let posterPath = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/' + movie.poster_path;
        return (
          <MovieCard key={movie.id} name={movie.original_title} overview={movie.overview} poster={posterPath} rating={movie.vote_average}/>
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

class App extends Component {
  render() {
    return (
      <div className='container'>
        <h1>Cast Movie App</h1>
        <MovieSearch />
      </div>
    );
  }
}

export default App;
