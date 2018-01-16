import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap'

class SearchResult extends Component {
  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col md={6} mdOffset={3}>
            <p>Name: {this.props.userSearch.name}</p>
            <p>Profile:
              <a href={this.props.userSearch.profile} target="_blank"> {this.props.userSearch.profile}</a>
            </p>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default SearchResult
