import React, { Component } from 'react'

class Image extends Component {
  state = {
    clicked: false,
    id: this.props.image._id
  };

  render() {
    const {
      image,
      clicked,
      click,
      ix
    } = this.props

    return (
      <div className='image-container' onClick={() => click(ix)}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <img className='paginated-image' src={`data:image/png;base64,${image.photo}`} />
          <p className='image-desc'>{image.metaName}</p>
          <input type="checkbox" className='image-checkbox' checked={clicked}/>
        </div>
      </div>
    )
  }
}

export default Image;
