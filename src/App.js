import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.less';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import MoviePage from './components/MoviePage';

class App extends Component {
  render() {
    return (
      <Router>
        <Route render={({ location }) => (
          <div className='movie-app'>
            <Switch location={location}>
              <Route exact path='/' component={Search}/>
              <Route exact path='/search' component={Search}/>
              <Route path='/search/:term' component={SearchResults}/>
              <Route path='/item/:number' component={MoviePage}/>
            </Switch>
          </div>
        )}/>
      </Router>
    );
  }
}

export default App;
