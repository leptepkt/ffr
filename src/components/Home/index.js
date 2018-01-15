import React, { Component } from 'react';
import './style.css';
import ImageUpload from '../ImageUpload'
import SearchResult from '../SearchResult'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userSearch: {
        name: '',
        profile: ''
      }
    }
    this.handleSearchResult = this.handleSearchResult.bind(this)
  }

  handleSearchResult(userSearch) {
    this.setState({userSearch})
  }

  render() {
    return (
      <div>
        <ImageUpload userSearch={this.state.userSearch} handleSearchResult={this.handleSearchResult}/>
        <SearchResult userSearch={this.state.userSearch}/>
      </div>
    )
  }
}
 export default Home
