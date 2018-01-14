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
    // TODO: do something with -> this.state.file
  }

  _handleImageChange (e) {
    e.preventDefault()

    let reader = new FileReader()
    if (e.target.files) {
      let file = e.target.files[0]
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
    let {imagePreviewUrl} = this.state
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
