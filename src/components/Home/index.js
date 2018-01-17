import React, { Component } from 'react'
import './style.css'
import ImageUpload from '../ImageUpload'
import SearchResult from '../SearchResult'
import FacebookLogin from 'react-facebook-login'
import { Col, Grid, Row } from 'react-bootstrap'

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
      fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
      }).then(res => res.json()).then(json => {
        console.log(json)
      })
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
          <ImageUpload userSearch={this.state.userSearch} handleSearchResult={this.handleSearchResult}/>
          <SearchResult userSearch={this.state.userSearch}/>
        </div>
      )
    } else {
      return (
        <Grid>
          <Row className="show-grid">
            <Col md={6} mdOffset={3}>
              <FacebookLogin textButton="Continue with Facebook" icon="fa-facebook-official"
                             appId="2006664906218812" autoLoad={true} fields="name, email"
                             scope="public_profile, email, user_photos"
                             callback={(response) => this.handleFbLogin(response)}/>
            </Col>
          </Row>
        </Grid>
      )
    }
  }

  render () {
    return this._render()
  }
}

export default Home
