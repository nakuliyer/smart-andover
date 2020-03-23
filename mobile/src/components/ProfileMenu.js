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

class ProfileMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fontLoaded: false,
      name: '',
      recent: '',
      streak: 0,
      totalPts: null
    }

    this.getName = this.getName.bind(this);
    this.getData = this.getData.bind(this);
    this.getStreak = this.getStreak.bind(this);
    this.getPts = this.getPts.bind(this);
    this.getFavoriteActivities = this.getFavoriteActivities.bind(this);

    this.getPts();
    this.getFavoriteActivities();
    this.getStreak();
    this.getName();
    this.getData();
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: "My Dashboard",
  })

  async componentDidMount() {
    await Font.loadAsync({
      'roboto-light': require('../../assets/fonts/roboto/Roboto-Light.ttf'),
      'roboto-medium': require('../../assets/fonts/roboto/Roboto-Medium.ttf'),
      'roboto-black': require('../../assets/fonts/roboto/Roboto-Black.ttf')
    })

    this.setState({ fontLoaded: true })
  }

  async getName() {
    await axios.get(config.api + `users/current`)
      .then((res) => this.setState({
        name: res.data.username
      }))
      .catch(() => this.setState({
        netErr: true
      }))
  }

  async getPts() {
    await axios.get(config.api + 'activities/pts')
      .then((res) => this.setState({
        totalPts: res.data.totalPts
      }))
      .catch((err) => console.log(err.response))
  }

  async getData() {
    await axios.get(config.api + `activities/recent`)
      .then((res) => this.setState({
        recent: res.data
      }))
      .catch(() => this.setState({
        netErr: true
      }))
  }

  async getStreak() {
    await axios.get(config.api + `activities/streak`)
      .then((res) => this.setState({
        streak: res.data
      }))
      .catch(() => this.setState({
        netErr: true
      }))
  }

  async getFavoriteActivities() {
    await axios.get(config.api + `activities/favorites?limit=5`)
      .then((res) => this.setState({
        favorites: res.data
      }))
      .catch(() => this.setState({
        netErr: true
      }))
  }

  shorten(text) {
    if (text.length < 11) {
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
    return text.charAt(0).toUpperCase() + text.slice(1, 7) + '...' + text.slice(-3)
  }

  render() {
    if (!this.state.fontLoaded || !this.state.name || !this.state.recent) { return null; }

    let sampleData = [
      {x: '2018-01-01', y: 30},
      {x: '2018-01-02', y: 200},
      {x: '2018-01-03', y: 170},
      {x: '2018-01-04', y: 250},
      {x: '2018-01-05', y: 10}
    ]

    const data = this.state.recent.map(({ runningPts }) => runningPts)
    const labels = this.state.recent.map(({ day }) => day)

    console.log(data)

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
        <Text />
        <SmartCard>
          {/*<Text style={styles.welcomeTitle}>{this.shorten(this.state.name)}'s Dashboard</Text>*/}
          <Text style={styles.welcomeText}>Your current submission streak is</Text>
          <Text style={styles.streakBox}>{this.state.streak} days</Text>
          <Text style={styles.welcomeBottomText}>{this.state.streak === 0 ? 'That\'s okay! Head back to the home screen to submit photos and get more points!' : 'Keep up the good environmentalism by submitting more actions!'}</Text>
          {/*<PureChart data={sampleData} type='line' />*/}
        </SmartCard>
        <SmartCard>
        <Text style={styles.welcomeTitle}>Points over Time</Text>
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: data
                }
              ]
            }}
            withInnerLines={true}
            withOuterLines={false}
            withDots={false}
            width={Dimensions.get("window").width - 60} // from react-native
            height={160}
            yAxisSuffix=" pts"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              // backgroundColor: "red",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              // backgroundGradientFrom: "red",
              // backgroundGradientTo: "white",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                // stroke: "#ffa726"
              }
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </SmartCard>
        {this.state.totalPts && this.state.favorites && <SmartCard>
          <Text style={styles.welcomeTitle}>Your Favorite Activities</Text>
          {this.state.favorites.map((i) => <FavoriteEcoBar img={images[i.metaCategory]} p={i.totalPts / this.state.totalPts} name={i.metaName} />)}
        </SmartCard>}
        <Text />
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

module.exports = ProfileMenu;
