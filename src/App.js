import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './App.less';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import MoviePage from './components/MoviePage';
import ScrollToTop from 'react-router-scroll-top';

class App extends Component {
  render() {
    return (
      <Router>
        <Route render={({ location }) => (
          <div className='movie-app'>
            <Route exact path='/' component={Search}/>
            <Route exact path='/search' component={Search}/>
            <TransitionGroup>
              <CSSTransition 
                key={location.key}
                classNames='fade'
                timeout={{enter: 300, exit: 300}}
              >
                <ScrollToTop>
                  <div className='swtich-section'>
                    <Switch location={location}>
                      <Route path='/search/:term' component={SearchResults}/>
                      <Route path='/item/:number' component={MoviePage}/>
                    </Switch>
                  </div>
                </ScrollToTop>
              </CSSTransition>
            </TransitionGroup>
          </div>
        )}/>
      </Router>
    );
  }
}

export default App;
