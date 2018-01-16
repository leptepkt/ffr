import React, { Component } from 'react'
import './style.css'
import ImageUpload from '../ImageUpload'
import SearchResult from '../SearchResult'
import FacebookLogin from 'react-facebook-login'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userSearch: {
        name: '',
        profile: ''
      },
      username: null
    }
    this.handleSearchResult = this.handleSearchResult.bind(this)
  }

  handleSearchResult (userSearch) {
    this.setState({userSearch})
  }

  handleFbLogin(response) {
    console.log(response)
    if (response) {
      this.setState({username: response.name})
    }
    else {
      this.setState({username: null})
    }
  }

  _render() {
    if (this.state.username) {
      return (
        <div>
          Welcome {this.state.username}
          <ImageUpload userSearch={this.state.userSearch} handleSearchResult={this.handleSearchResult}/>
          <SearchResult userSearch={this.state.userSearch}/>
        </div>
      )
    } else {
      return (
        <FacebookLogin textButton="Continue with Facebook" icon="fa-facebook-official"
                       appId="2006664906218812" autoLoad={true} fields="name,email,picture"
                       callback={(response) => this.handleFbLogin(response)}/>
      )
    }
  }

  render () {
    return this._render()
  }
}

export default Home
