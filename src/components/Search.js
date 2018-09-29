import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Search.less';

class Search extends Component {
    constructor(props) {
      super(props);
      this.state = {
        inputValue: ''
      };
    }
  
    render() {
      return (
        <div className='container'>
          <div className='c-search'>
            <input type="text" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} onKeyUp={evt => this.triggerSearch(evt)} className='c-search__input' placeholder='Search for Movies'></input>
            <Link className='c-search__submit c-btn c-primary-btn' to={`/search/${this.state.inputValue}`} replace>Find Movie</Link>
          </div>
        </div>
      );
    }

    updateInputValue(evt) {
      this.setState({
        inputValue: evt.target.value
      });
    }

    triggerSearch(evt) {
      evt.preventDefault();
      if (evt.keyCode === 13) {
        document.querySelector('.c-search__submit').click();
      }
    }
  }

  export default Search;