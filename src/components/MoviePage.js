import React, { Component } from 'react';
import Cheerio from 'cheerio'
import './MoviePage.less';
import BackButton from './BackButton';
import PlayIcon from '../assets/img/play-circle.svg';

class MoviePage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        movieResponse: [],
        movieBackdrop: '',
        movieTrailer: '',
        netflixMovies: []
      };
    }
  
    componentDidMount() {
      fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.number}?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US`)
      .then(response => {
        return response.json();
      }).then(result => {
          
          // store tmdb backdrop
          this.setState({movieBackdrop: 'https://image.tmdb.org/t/p/original' + result.backdrop_path})
  
          // Make a subsequent request to imdb to get improved movie data
          fetch('https://www.omdbapi.com/?i=' + result.imdb_id + '&apikey=dbbd0a02')
          .then(imdb_response => {
            return imdb_response.json();
          }).then(imdb_result => {
            this.setState({movieResponse: imdb_result})
          });
      })
  
      // get movie trailer link
      fetch(`https://api.themoviedb.org/3/movie/${this.props.match.params.number}/videos?api_key=53f9a01f084ff957f8d4f94dbd002089&language=en-US`)
      .then(response => {
        return response.json();
      }).then(result => {
        // store trailer link
        if (result.results.length) {
          for (let i = 0; i < result.results.length; i++) {
            if (result.results[i].type === 'Trailer') {
              this.setState({movieTrailer: result.results[0].key});
              break;
            }
          }
        }
      });

      // is it on netflix?
      fetch('https://www.finder.com/netflix-movies')
      .then(response => {
        if (response.status === 200) {
          return response.text();
        }
      }).then(result => {
          let netflixList = [];
          const $ = Cheerio.load(result);
          $('.custom-table td b').each(function(i) {
            netflixList[i] = $(this).text();
          });
          this.setState({netflixMovies: netflixList});
      });
    } 
  
    render() {
      return (
        <div className='single-movie-page'>
          <div className='c-backdrop' style={{backgroundImage: `linear-gradient(rgba(63, 65, 72, 0.65), rgba(63, 65, 72, 0.65)), url(${this.state.movieBackdrop})`}}></div>
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
              <div className='c-btn-row'>
                {this.onNetflix(this.state.movieResponse.Title) &&
                  <a href={`https://www.netflix.com/search?q=${this.state.movieResponse.Title}`} className='c-btn c-primary-btn'>Watch on Netflix</a>
                }
                {this.state.movieTrailer !== '' &&
                  <a href={`https://www.youtube.com/watch?v=${this.state.movieTrailer}`} className='c-btn c-secondary-btn'>
                    <div className='flex flex--center'>
                      <div>Watch Trailer</div> 
                      <div><img src={PlayIcon} alt='Play Icon' className='c-play-icon'/></div>
                    </div>
                  </a>
                }
              </div>
            </div>
            <div className='c-movie__poster'>
              <img src={this.state.movieResponse.Poster} alt={this.state.movieResponse.Title}/>
            </div>
          </div>
        </div>
      );
    }

    onNetflix(title) {
      return (this.state.netflixMovies.indexOf(title) > -1);   
    }
  }

  export default MoviePage;