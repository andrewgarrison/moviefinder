import React, { Component } from 'react';
import './MovieCard.less';

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

  export default MovieCard;