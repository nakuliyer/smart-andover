import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

const styles = StyleSheet.create({
  profileImage: {
    width: 30,
    height: 30,
    marginRight: 15,
    borderRadius: 15
  },
})

class SettingsIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('SettingsMenu')}
      >
        <Image
          source={require('../../assets/ui/settings.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    )
  }
}

export default SettingsIcon
