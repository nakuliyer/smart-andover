import React, { Component } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  dailyGoalBar: {
    backgroundColor: '#eee',
    marginTop: 15,
    borderRadius: 20,
    height: 30,
    width: '75%',
    zIndex: 400
  },
  dailyGoalFiller: {
    backgroundColor: '#00319c',
    height: 30,
    borderRadius: 20,
    zIndex: 500
  },
  dailyGoalText: {
    fontSize: 20,
    height: 30,
    fontWeight: 'bold',
    padding: 2,
    marginTop: 15,
    marginLeft: 8,
    alignItems: 'center'
  },
})

class DailyBar extends Component {
  constructor() {
    super(...arguments)
    this.animated = new Animated.Value(0)
  }

  componentDidMount() {
    const width = this.props.dailyGoal
    Animated.timing(this.animated, {
      toValue: width,
      duration: 800,
      easing: Easing.log,
    }).start()
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.dailyGoalBar}>
          <Animated.View
            style={[ styles.dailyGoalFiller, {
              width: this.animated.interpolate({
                inputRange: [ 0, 1 ],
                outputRange: [ '0%', '100%' ],
              })
            } ]}
          />
        </View>
        <Text style={styles.dailyGoalText}>{this.props.ptsToday} pts</Text>
      </View>
    )
  }
}

export default DailyBar