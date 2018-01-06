import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import './App.css';
import About from '../About'
import Home from '../Home'
import NotFound from '../NotFound'
import Footer from '../Footer'

class App extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="*" component={NotFound}/>
        </Switch>

        <Footer/>
      </main>
    );
  }
}

export default App;
