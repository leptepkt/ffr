import React, { Component } from 'react'
import './style.css'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Grid, Image, Row } from 'react-bootstrap'

class ImageUpload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      file: '',
      imagePreviewUrl: ''
    }
    this._handleImageChange = this._handleImageChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit (e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', this.state.file)
    return fetch('http://localhost:3000/api/image/upload', {
      method: 'POST',
      body: formData
    }).then(response => response.json())
      .then(json => {
        if (json.status === 0) {
          const userSearch = {
            name: JSON.parse(json.data).name,
            profile: JSON.parse(json.data).userData
          }
          this.props.handleSearchResult(userSearch)
        }
      })
  }

  _handleImageChange (e) {
    e.preventDefault()
    const reader = new FileReader()
    if (e.target.files) {
      const file = e.target.files[0]
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  render () {
    const {imagePreviewUrl} = this.state
    let $imagePreview = null
    if (imagePreviewUrl) {
      $imagePreview = (<Image src={imagePreviewUrl} className="image-preview" responsive />)
    }

    return (
      <Grid>
        <Row className="show-grid">
          <Col md={6} mdOffset={3}>
            <Form onSubmit={this._handleSubmit} inline>
              <FormGroup>
                {/*<ControlLabel>Image</ControlLabel>*/}
                <FormControl type="file" onChange={this._handleImageChange}/>
              </FormGroup>
              <Button type="submit" bsStyle="primary">Upload Image</Button>
            </Form>
          </Col>
          <Col md={6} mdOffset={3}>
            {$imagePreview}
          </Col>
        </Row>

      </Grid>
    )
  }
}

export default ImageUpload
