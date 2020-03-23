import React, { Component } from 'react'
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Button
} from 'react-native'
import LogoTitle from './LogoTitle'
import axios from 'axios'
import * as Expo from 'expo'
import * as SecureStore from 'expo-secure-store';

import config from '../../config'
import LogInScreen from './LogInScreen'
import LoggedInScreen from './LoggedInScreen'

class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      jwt: "",
      passUnavailable: false
    }

    this.authorize = this.authorize.bind(this);
    this.loginKeychain = this.loginKeychain.bind(this);
  }

  componentDidMount() {
    this.loginKeychain();
  }

  // async componentDidMount() {
  //   const e = SecureStore.getItemAsync('SmartAndoverEmail').then((email) => {
  //     if (!email) {
  //       passUnavailable = true;
  //     } else {
  //       this.setState({
  //         emailKey: email
  //       })
  //     }
  //   })
  //   const p = SecureStore.getItemAsync('SmartAndoverPassword').then((pass) => {
  //     if (!pass) {
  //       passUnavailable = true;
  //     } else {
  //       this.setState({
  //         emailPassword: pass
  //       })
  //     }
  //   })
  // }

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.getParam('center', null),
    headerRight: navigation.getParam('right', null),
    headerLeft: navigation.getParam('left', null),
  })

  authorize(token) {
    this.setState({
      jwt: token
    })
  }

  async loginKeychain() {
    console.log('attempting')
    const e = await SecureStore.getItemAsync('SmartAndoverEmail').then((email) => {
      if (!email) {
        this.setState({
          passUnavailable: true
        })
      } else {
        return email
      }
    })
    const p = await SecureStore.getItemAsync('SmartAndoverPassword').then((pass) => {
      if (!pass) {
        this.setState({
          passUnavailable: true
        })
      } else {
        return pass
      }
    })
    axios.post(config.api + 'users/login', {
      email: e,
      password: p
    })
      .then((res) => {
        this.authorize(res.headers['auth-token'])
      })
      .catch();
  }

  render() {
    const { navigation } = this.props

    if (this.state.jwt) {
      navigation.navigate('SettingsMenu')
      return (
        <LoggedInScreen
          jwt={this.state.jwt}
          navigation={navigation}
          loginKeychain={this.loginKeychain}
        />
      )
    }

    if (this.state.passUnavailable) {
      return (
        <LogInScreen
          authorize={this.authorize}
          navigation={navigation}
        />
      )
    }

    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  pinImg: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginRight: 15
  },
})

export default HomeScreen
