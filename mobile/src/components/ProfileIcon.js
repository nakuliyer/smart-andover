import React, { Component } from 'react'
import { Image, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  profileImage: {
    width: 30,
    height: 30,
    marginHorizontal: 15,
    borderRadius: 15
  },
})

class ProfileIcon extends Component {
  render() {
    return (
      <Image
        source={require('../../assets/def_profile.png')}
        style={styles.profileImage}
      />
    )
  }
}

export default ProfileIcon