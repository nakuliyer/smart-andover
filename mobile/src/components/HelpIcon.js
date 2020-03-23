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

class HelpIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('HelpMenu')}
      >
        <Image
          source={require('../../assets/ui/help.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    )
  }
}

export default HelpIcon
