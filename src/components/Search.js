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

  export default Search;