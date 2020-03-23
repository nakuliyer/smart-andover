import React, { Component } from 'react'
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Button,
  Dimensions
} from 'react-native'
import * as Font from 'expo-font'
import axios from 'axios';

import config from '../../config'
import SmartCard from './SmartCard'
import FavoriteEcoBar from './FavoriteEcoBar'
import PureChart from 'react-native-pure-chart'
import {
  LineChart
} from "react-native-chart-kit";

const images = {
  eat: require(`../../assets/eco-icons/eat.png`),
  drink: require(`../../assets/eco-icons/drink.png`),
  clean: require(`../../assets/eco-icons/clean.png`),
  reduce: require(`../../assets/eco-icons/reduce.png`),
  reuse: require(`../../assets/eco-icons/reuse.png`),
  recycle: require(`../../assets/eco-icons/recycle.png`),
  innovate: require(`../../assets/eco-icons/innovate.png`),
  energy: require(`../../assets/eco-icons/energy.png`),
  engage: require(`../../assets/eco-icons/engage.png`)
}

class SettingsMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: "Settings",
  })

  render() {
    if (!this.state.fontLoaded) { return null; }

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  welcomeTitle: {
    fontFamily: 'roboto-medium',
    fontSize: 18,
    marginBottom: 15
  },
  welcomeText: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'roboto-light'
  },
  welcomeBottomText: {
    width: '100%',
    textAlign: 'left',
    marginTop: 5,
    fontFamily: 'roboto-light'
  },
  streakBox: {
    fontSize: 30,
    textAlign: 'center',
    color: '#00319c',
    fontFamily: 'roboto-medium'
  },
})

module.exports = SettingsMenu;
