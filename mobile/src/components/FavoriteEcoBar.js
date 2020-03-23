import React, { Component } from 'react'
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native'
import SmartCard from './SmartCard'

const styles = StyleSheet.create({
  imgLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 7,
    marginBottom: 5,
    maxWidth: Dimensions.get('window').width - 130
  },
  imgs: {
    width: 40,
    height: 40,
    marginVertical: 5,
    marginLeft: 5,
    marginRight: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  rightView: {
    display: 'flex',
    flexDirection: 'column'
  },
  barBackground: {
    width: Dimensions.get('window').width - 130,
    height: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  bar: {
    maxWidth: Dimensions.get('window').width - 130,
    height: 5,
    backgroundColor: '#00319c'
  }
})

class FavoriteEcoBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={this.props.img}
          style={styles.imgs}
        />
        <View style={styles.rightView}>
          <Text style={styles.imgLabel} numberOfLines={1}>{this.props.name}</Text>
          <View style={styles.barBackground}>
            <View style={[styles.bar, { width: (Dimensions.get('window').width - 130)*this.props.p }]}></View>
          </View>
        </View>
      </View>
    )
  }
}

export default FavoriteEcoBar
