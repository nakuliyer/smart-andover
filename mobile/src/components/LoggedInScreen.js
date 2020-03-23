import React, { Component, Fragment } from 'react'
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button
} from 'react-native'
import SmartCard from './SmartCard'
import LogoTitle from './LogoTitle'
import ProfileIcon from './ProfileIcon'
import HelpIcon from './HelpIcon'
import SettingsIcon from './SettingsIcon'
import EcoIcon from './EcoIcon'
import * as Font from 'expo-font'
import truncateNum from '../utilities/truncateNum'
import toUnicode from '../utilities/unicode'
import { RippleLoader } from 'react-native-indicator'
import LogInScreen from './LogInScreen'
import axios from 'axios';
// import RNFetchBlob from 'react-native-fetch-blob'

import config from '../../config'

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

const categories = [
  ['eat', 'drink', 'clean'],
  ['reduce', 'reuse', 'recycle'],
  ['innovate', 'energy', 'engage']
]

class LoggedInScreen extends Component {
  constructor(props) {
    super(props)
    axios.defaults.headers.common = { 'auth-token' : this.props.jwt }

    this.state = {
      funFact: "",
      ecoIcons: {},
      name: "User",
      fontLoaded: false,
      totalPts: null,
      totalCO2: null,
      unviewed: [],
      netErr: ''
    }

    this.getFunFact = this.getFunFact.bind(this);
    this.getName = this.getName.bind(this);
    this.getPts = this.getPts.bind(this);
    this.getUnviewed = this.getUnviewed.bind(this);
    this.getEcoicons = this.getEcoicons.bind(this);
    this.view = this.view.bind(this);

    this.getFunFact();
    this.getName();
    this.getPts();
    this.getEcoicons();
    this.getUnviewed();
  }

  getEcoicons() {
    Promise.all(categories.flat().map(this.getEcocategory))
      .then((categoriesList) => {
        const initialValue = {}
        const ecoIcons = categoriesList.reduce((obj, item) => {
          return {
            ...obj,
            [item['id']]: item,
          };
        }, initialValue);
        this.setState({
          ecoIcons
        })
      })
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      left: <LogoTitle />,
      right: <Fragment><SettingsIcon navigation={this.props.navigation}/><HelpIcon navigation={this.props.navigation}/><ProfileIcon navigation={this.props.navigation} /></Fragment>,
      center: null
    })

    await Font.loadAsync({
      'roboto-light': require('../../assets/fonts/roboto/Roboto-Light.ttf'),
      'roboto-medium': require('../../assets/fonts/roboto/Roboto-Medium.ttf'),
      'roboto-black': require('../../assets/fonts/roboto/Roboto-Black.ttf')
    })

    this.setState({ fontLoaded: true })
  }

  async getPts() {
    await axios.get(config.api + 'activities/pts')
      .then((res) => this.setState({
        totalPts: res.data.totalPts,
        totalCO2: res.data.totalCO2
      }))
      .catch((err) => console.log(err.response))
  }

  async getUnviewed() {
    await axios.get(config.api + 'activities/unviewed')
      .then((res) => this.setState({
        unviewed: res.data
      }))
      .catch((err) => console.log(err.response))
  }

  async view() {
    await axios.post(config.api + `activities/view/${this.state.unviewed[0]._id}`)
      .then((res) => this.setState({
        unviewed: this.state.unviewed.slice(1)
      }))
  }

  async getFunFact() {
    await axios.get(config.api + 'funfacts/random')
      .then((res) => this.setState({
        funFact: toUnicode(res.data)
      }))
      .catch((err) => console.log(err.response))
  }

  async getEcocategory(category) {
    return axios.get(config.api + `ecocategories/${category}`)
      .then((res) => res.data)
      .catch((res) => console.log(res.response))
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

  async postActivity(submitData) {
    console.log('posting')
    await axios.post(config.api + 'activities/add', submitData)
    this.getEcoicons();
    return
  }

  render() {
    const {
      navigation: {
        navigate,
        getParam,
        setParams
      }
    } = this.props

    if (!this.state.fontLoaded) return null

    const submitData = getParam('submitData')
    if(submitData) {
      setParams({
        submitData: null
      })
      this.getEcoicons();
    }

    if (this.state.netErr) {
      this.props.loginKeychain()
    }

    return (
      <View style={styles.container}>
        {this.state.unviewed.length > 0 && <View style={styles.overlayContainer}>
          <SmartCard style={styles.overlay}>
            <Text style={styles.pointsAwardedText}>You
                                                   got {this.state.unviewed[ 0 ].metaPts} point{this.state.unviewed[ 0 ].metaPts > 1 ? 's ' : ' '}
                                                   for:</Text>
            <Text />
            <Text style={styles.pointsAwardedNumber}>{this.state.unviewed[ 0 ].metaName}</Text>
            <Text />
            <Button
              title={'Continue'}
              onPress={this.view} // view
            />
          </SmartCard>
        </View>}
        {submitData &&
        <View style={styles.overlayContainer}>
          <SmartCard style={styles.overlay}>
            <Text style={styles.pointsAwardedText}>{typeof submitData === 'string' ? submitData : 'Uploading Submission...'}</Text>
            <Text />
            <RippleLoader />
            <Text />
          </SmartCard>
        </View>}
        {/*<View style={{ opacity: verified.length > 0 || (submitData && submitData !== 'completed') ? 0.1 : 1 }}>*/}
        {this.state.netErr ? <View style={styles.overlayContainer}>
          <SmartCard style={styles.overlay}>
            <Text style={styles.funFactLabel}>Sorry, there was a network error :( Try again later!</Text>
          </SmartCard>
          </View> : <View style={{ opacity: submitData || this.state.unviewed.length > 0 ? 0.1 : 1 }}>
          <StatusBar barStyle="default" />
          <Text />
          <SmartCard>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.ptsBox}>
                <Text style={styles.ptsText}>{this.state.totalPts && truncateNum(this.state.totalPts, 'integer')}</Text>
                <Text style={styles.ptsLabel}>Total Points</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.ptsBox}>
                <Text style={styles.ptsText}>{this.state.totalCO2 && truncateNum(this.state.totalCO2, 'double')}</Text>
                <Text style={styles.ptsLabel}>Total CO{'\u2082'} Saved</Text>
              </View>
            </View>
            <Text style={styles.greetingText}>Welcome to the Smart Andover
                                              App, {this.state.name}!</Text>
          </SmartCard>
          {this.state.funFact ? <SmartCard>
            <View>
              <Text style={styles.cardTitles}>Fun Fact</Text>
              <Text style={styles.funFact}>{this.state.funFact}</Text>
            </View>
          </SmartCard> : null}
          {Object.keys(this.state.ecoIcons).length === 9 && categories.map((row) =>
            <View style={{ flexDirection: 'row'}}>
              {row.map((iName) =>
                <TouchableOpacity
                  onPress={() => navigate('Submission', {
                    meta: this.state.ecoIcons[iName],
                    typeId: iName
                  })}
                >
                  <EcoIcon
                    name={iName.charAt(0).toUpperCase() + iName.substring(1)}
                    img={images[iName]}
                    c={this.state.ecoIcons[iName].color}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  ptsBox: {
    width: '45%',
    display: 'flex',
    flexDirection: 'column'
  },
  ptsText: {
    fontSize: 36,
    textAlign: 'center',
    color: '#00319c',
    fontFamily: 'roboto-medium'
  },
  ptsLabel: {
    textAlign: 'center',
    fontFamily: 'roboto-light',
    width: '100%',
    lineHeight: 20,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  greetingText: {
    marginTop: 15,
    fontFamily: 'roboto-light',
    textAlign: 'center'
  },
  funFactLabel: {
    fontFamily: 'roboto-medium'
  },
  funFact: {
    fontFamily: 'roboto-light'
  },
  divider: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  pinImg: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginRight: 15
  },
  overlayContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlay: {
    // marginLeft: 15
  },
  pointsAwardedText: {
    fontFamily: 'roboto-light',
    fontSize: 21
  },
  pointsAwardedNumber: {
    fontFamily: 'roboto-medium',
    fontSize: 17
  },
  cardTitles: {
    fontFamily: 'roboto-medium',
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 5
  }
})

export default LoggedInScreen;
