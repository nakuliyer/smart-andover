import React, { Component } from 'react'
import { Image, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  logoImage: {
    width: 150,
    height: 30,
    marginHorizontal: 15
  },
})

class LogoTitle extends Component {
  render() {
    return (
      <Image
        source={require('../../assets/logos/SmartAndoverLCrop.png')}
        style={styles.logoImage}
      />
    )
  }
}

export default LogoTitle