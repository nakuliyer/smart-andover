import React, { Component } from 'react'
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Button,
  Dimensions,
  Image
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

class HelpMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: "Help",
  })

  async componentDidMount() {
    await Font.loadAsync({
      'roboto-light': require('../../assets/fonts/roboto/Roboto-Light.ttf'),
      'roboto-medium': require('../../assets/fonts/roboto/Roboto-Medium.ttf'),
      'roboto-black': require('../../assets/fonts/roboto/Roboto-Black.ttf')
    })

    this.setState({ fontLoaded: true })
  }

  render() {
    if (!this.state.fontLoaded) { return null; }

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
        <Text />
        <SmartCard>
          <Text style={styles.welcomeTitle}>Welcome to the Smart<Text style={{color: '#00319c'}}>Andover</Text> App</Text>
          <Text style={{fontFamily: 'roboto-light'}}>
            {"\t"}Smart Andover is a club focused on taking principles of Smart Cities and implementing them at Phillips Academy. Essentially, Smart Cities are interactive communities of people and technologies. They use sustainable initiatives in order to conserve resources and collect data that helps to improve their community. Smart Campuses such as Princeton, Harvard, and Ohio State have used the driving principles behind Smart Cities to become more sustainable. Although these are college campuses, Andover functions similarly in many ways.
            {"\n\n\t"}
            This app is one of our many initiatives to reach this goal. It works based on a photo-verification system. First, you select from our many options of eco-friendly activities (or create your own in the "Innovate" section).
          </Text>
          <Image
            source={require('../../assets/ui/intro/recycling.png')}
            style={styles.howToImages}
          />
          <Text style={{fontFamily: 'roboto-light'}}>
            Next you upload a photo of yourself doing that action to this app under the right category.
          </Text>
          <Image
            source={require('../../assets/ui/intro/takePhoto.png')}
            style={styles.howToImages}
          />
          <Text style={{fontFamily: 'roboto-light'}}>
            You can earn points once we verify your submissions, and trade these points in for cash and gift cards later on! Stay tuned for more info regarding prizes.
          </Text>
          <Image
            source={require('../../assets/ui/intro/money.jpg')}
            style={styles.howToImages}
          />
          <Text style={{fontFamily: 'roboto-light'}}>
            {"\t"}
            All submissions will be reviewed by the Smart Andover Board before you are awarded points. If you believe that you should've gotten points that we didn't give you, please send an email to smartandover@gmail.com. Even though we will do our best to verify images, we could on your support and good judgement in submitting photos. We take your security very seriously; all usernames and passwords are hidden from us, and photo submissions are both anonymous and swiftly deleted after submission.
            {"\n\n\t"}
            This app was designed by Nakul Iyer '20.
          </Text>
        </SmartCard>
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
  howToImages: {
    width: 100,
    height: 100,
    marginVertical: 15
  }
})

module.exports = HelpMenu;
