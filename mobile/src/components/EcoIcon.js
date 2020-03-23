import React, { Component } from 'react'
import { Image, StyleSheet, Text } from 'react-native'
import SmartCard from './SmartCard'

const styles = StyleSheet.create({
  imgLabel: {
    paddingTop: 5,
    paddingLeft: 5,
    fontWeight: 'bold',
    fontSize: 16
  },
  imgs: {
    width: 60,
    height: 60
  }
})

class EcoIcon extends Component {
  render() {
    return (
      <SmartCard
        ws={3}
        color={this.props.c}
        rounded
        ratio={0.8}
      >
        <Image
          source={this.props.img}
          style={styles.imgs}
        />
        {/*<Text style={styles.imgLabel}>{this.props.name}</Text>*/}
      </SmartCard>
    )
  }
}

export default EcoIcon
