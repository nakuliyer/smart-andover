import React, { Component } from 'react'
import {
  Animated,
  Easing,
  Text,
  View,
  StyleSheet,
  Dimensions
} from 'react-native'

class SmartCard extends Component {

  constructor() {
    super()

    this.animated = new Animated.Value(5)
  }

  componentDidMount() {
    Animated.timing(this.animated, {
      toValue: 5,
      duration: 800,
      easing: Easing.log,
    }).start()
  }

  render() {
    const backgroundColor = this.props.color ? this.props.color : '#fff'
    const width = this.props.ws ? (Dimensions.get('window').width - 15 * (this.props.ws + 1)) / this.props.ws + this.props.ws : Dimensions.get('window').width - 30
    const height = this.props.height || this.props.ratio ? this.props.ratio * width : undefined
    const borderRadius = this.props.rounded ? 35 : 0
    return (
      <View
        style={[ styles.card, {
          backgroundColor: backgroundColor,
          width: width,
          height: height
        } ]}
      >
        {this.props.children}
      </View>
    )
    // return (
    //   <Animated.View
    //     style={[ styles.card, {
    //       backgroundColor: backgroundColor,
    //       width: width,
    //       height: height,
    //       borderRadius: borderRadius,
    //       marginTop: this.animated
    //     } ]}
    //   >
    //     {this.props.children}
    //   </Animated.View>
    // )
  }
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    // shadowOffset: {
    //   width: 1,
    //   height: 3
    // },
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    borderWidth: 1,
    // shadowColor: 'black',
    // shadowOpacity: 0.2,
    // shadowRadius: 1,
    margin: 5,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  }
})

export default SmartCard
