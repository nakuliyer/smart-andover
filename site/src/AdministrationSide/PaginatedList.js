import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Loader from 'react-loader'

import Image from './Image'
import config from '../config'

class PaginatedList extends Component {
  constructor(props) {
    super(props)

    const LIMIT = 10

    this.state = {
      page: 0,
      limit: LIMIT,
      images: [],
      clicked: new Array(LIMIT).fill(false)
    }

    this.getImagesPaginated = this.getImagesPaginated.bind(this);
    this.click = this.click.bind(this);
    this.verifySelected = this.verifySelected.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
  }

  getImagesPaginated(limit, page) {
    console.log('called with limit ' + limit + ' and page ' + page + ' argument')
    axios.get(config.api + `activities/admin?limit=${limit}&page=${page}`)
      .then((res) => this.setState({
        images: res.data
      }))
  }

  click(i) {
    let tempClicked = this.state.clicked;
    tempClicked[i] = !tempClicked[i]
    this.setState({
      clicked: tempClicked
    })
  }

  verifySelected() {
    const promises = []
    Array(this.state.images.length).fill(0).forEach((q, i) => {
      if(this.state.clicked[i]) {
        promises.push(axios.post(config.api + `activities/verify/${this.state.images[i]._id}`))
      }
    })
    Promise.all(promises)
      .then(() => {
        this.props.forceRecount();
        this.setState({
          images: [],
          clicked: new Array(this.state.limit).fill(false)
        })
      })
  }

  deleteSelected() {
    const promises = []
    Array(this.state.images.length).fill(0).forEach((q, i) => {
      if(this.state.clicked[i]) {
        promises.push(axios.delete(config.api + `activities/${this.state.images[i]._id}`))
      }
    })
    Promise.all(promises)
      .then(() => {
        this.props.forceRecount();
        this.setState({
          images: [],
          clicked: new Array(this.state.limit).fill(false)
        })
      })
  }

  render() {
    const {
      total,
    } = this.props

    const {
      limit,
      page,
      images,
      clicked
    } = this.state

    const totalPages = Math.floor((total-1)/limit)
    if (!images.length && total) {
      this.getImagesPaginated(limit, page)
    }

    return (
      <div className="paginated-container">

        <div className="image-gallery">
        {images.length ? images.map((image, i) =>
          <Image key={i} ix={i} image={image} clicked={clicked[i]} click={this.click} />
        ) : <Loader loaded={false} options={{
              lines: 20,
              length: 20,
              width: 4,
              radius: 30,
              scale: 1.00,
              corners: 1,
              color: '#417580',
              opacity: 0.25,
              rotate: 0,
              direction: 1,
              speed: 1,
              trail: 60,
              fps: 20,
              zIndex: 2e9,
              top: '50%',
              left: '50%',
              shadow: false,
              hwaccel: false,
              position: 'absolute'
          }}/>}
        </div>

        <div className='verify-box' style={{width: 413}}>
          <button onClick={() => this.setState({
            clicked: new Array(this.state.limit).fill(true)
          })}>Select All Images</button>
          <button onClick={() => this.setState({
            clicked: new Array(this.state.limit).fill(false)
          })}>Deselect All Images</button>
        </div>
        <div className='verify-box' style={{width: 505}}>
          <button onClick={this.verifySelected}>Verify Selected Images</button>
          <button onClick={this.deleteSelected} style={{backgroundColor: 'red'}}>Delete Selected Images</button>
        </div>

        <div className="pagination-bar">
          {page === 0 ?   <div style={{width: 200}}></div> :
            <div style={{width: 200}}>
            <div onClick={e => this.setState({
              page: 0,
              images: [],
              clicked: new Array(this.state.limit).fill(false)
            })}>&lt;&lt;</div>
            &emsp;
            <div onClick={e => this.setState({
              page: page-1,
              images: [],
              clicked: new Array(this.state.limit).fill(false)
            })}>&lt;</div>
            &emsp;
            </div>
          }
          <div>{page+1}</div>
          {page === totalPages ?   <div style={{width: 240}}></div> :
            <div style={{width: 240}}>
              &emsp;
            <div onClick={e => this.setState({
              page: page+1,
              images: [],
              clicked: new Array(this.state.limit).fill(false)
            })}>&gt;</div>
            &emsp;
            <div onClick={e => this.setState({
              page: totalPages,
              images: [],
              clicked: new Array(this.state.limit).fill(false)
            })}>&gt;&gt;</div>
            </div>
          }
        </div>
        <div className={'page-num-label'}>Page {page+1} of {totalPages+1} &emsp;&emsp;</div>
      </div>
    )
  }
}

export default PaginatedList;
