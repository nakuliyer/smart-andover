import React, { Component } from 'react'
import { Text, View, StatusBar, StyleSheet } from 'react-native'

const styles = StyleSheet.create({

})

class RadioButton extends Component {
  static propTypes = {}

  render() {
    const { classes, style, selected } = this.props

    return (
      <View
        style={[ {
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: 'rgba(0, 0, 0, 0.3)',
          alignItems: 'center',
          justifyContent: 'center',
        }, style ]}
      >
        {
          selected() ?
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            />
            : null
        }
      </View>
    )
  }
}

export default RadioButton