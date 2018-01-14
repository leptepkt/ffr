import React, { Component } from 'react';
import './style.css';
import ImageUpload from '../ImageUpload'

class Home extends Component {
  render() {
    return (
      <div>
        This is home
        <ImageUpload/>
      </div>
    )
  }
}
 export default Home
