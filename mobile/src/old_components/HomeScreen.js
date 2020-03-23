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
import SmartCard from './SmartCard'
import LogoTitle from './LogoTitle'
import EcoIcon from './EcoIcon'
import ProfileIcon from './ProfileIcon'
import DailyBar from './DailyBar'
import axios from 'axios'
import * as Expo from 'expo'
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  CustomCredential
} from 'mongodb-stitch-react-native-sdk'
import cryptoJS from 'crypto-js'
// import { jwt } from 'jsonwebtoken'
const jwt = require('react-native-pure-jwt')
import { Base64 } from 'js-base64'

import config from '../../config'
import LogInScreen from './LogInScreen'
import LoggedInScreen from './LoggedInScreen'

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      userData: undefined,
      client: undefined,
      uploadedPhotos: []
    }

    this.loadClient = this.loadClient.bind(this)
    this.setUser = this.setUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.signInUser = this.signInUser.bind(this)
    this.loadUser = this.loadUser.bind(this)
  }

  static navigationOptions = {
    headerTitle: <LogoTitle />,
    // headerRight: <ProfileIcon />
  }

  componentWillMount() {
    this.loadClient()
  }

  loadClient() {
    const APP_ID = config.mongo.APP_ID

    const app = Stitch.hasAppClient(APP_ID)
      ? Stitch.getAppClient(APP_ID)
      : Stitch.initializeAppClient(APP_ID)

    app.then(client => {
      this.setState({ client })
      const dbClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      this.setState({ atlasClient: dbClient })
      this.setState({
        collection: dbClient
          .db(config.mongo.db)
          .collection(config.mongo.collection)
      })
    })
  }

  async setUser(userData) {
    await this.state.collection.insertOne(userData)
  }

  async updateUser(newData) {
    await this.state.collection.updateOne(
      { owner_id: this.state.currentUserId },
      newData
    )
    await this.loadUser()
  }

  async getColId() {
    return this.state.collection.find({ owner_id: this.state.currentUserId }, { limit: 1 }).first().then(foundDoc => {
      if (foundDoc) {
        return foundDoc
      } else {
        return null
      }
    })
  }

  async loadUser() {
    let userData = await this.getColId()
    if (!userData) {
      const newUserData = {
        owner_id: this.state.currentUserId,
        name: 'Unnamed',
        ptsTotal: 0,
        co2Total: 0,
        verified: [ {
          'name': 'Getting the Smart Andover App!',
          'id': 'getting the smart andover app',
          pts: 10,
          co2: 0,
          limit: {
            times: 1,
            rate: 'total'
          },
          ts: Math.floor(Date.now() / 1000)
        } ],
        toBeVerified: [],
        history: []
      }
      this.setUser(newUserData)
      userData = newUserData
    }
    if (!userData) return null
    this.setState({
      userData: userData
    })
    return true
  }

  async anonymousLogin() {
    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`Successfully logged in as user ${user.id}`)
      this.setState({ currentUserId: user.id })
    }).catch(err => {
      console.log(`Failed to log in anonymously: ${err}`)
      this.setState({ currentUserId: undefined })
    })
  }

  async customLogin() {
    // const jwtString = cryptoJs.HmacSHA256(
    //   base64UrlEncode({ "alg": "HS256", "typ": "JWT" }) + "." + base64UrlEncode({ "alg": "HS256", "typ": "JWT" }),
    //   config.jwt.key
    // ).toString()
    // console.log("******************")
    const header = {
      alg: "HS256"
    }
    const payload = {
      aud: config.jwt.aud,
      sub: 213801230818,
      exp: Date.now() + 60 * 60 * 60 * 24
    }
    // const header = Base64.encodeURI(`{"alg":"HS256","typ":"JWT"}`)
    // const payload = Base64.encodeURI(`{"aud":"${config.jwt.aud}","sub":"${'01845'}","exp":"${Date.now() + 60 * 60 * 48 }"}`)
    // const data = header + "." + payload
    console.log(JSON.stringify(header))
    const data = Base64.encodeURI(JSON.stringify(header)) + "." + Base64.encodeURI(JSON.stringify(payload))
    const signature = cryptoJS.enc.Base64.stringify(cryptoJS.HmacSHA256(data, config.jwt.key))
    console.log(signature)
    const jwtString = data + "." + signature
    console.log('++++++++++++++')
    console.log(jwtString)
    console.log('++++++++++++++')
    // const signingKey = Base64.encodeURI(config.jwt.key)
    // console.log(header + "." + payload)
    // const jwtString = header + "." + payload + "." + signingKey
    // console.log('----')
    // console.log(jwtString)

    // console.log(header + "." + payload)
    // console.log(Base64.encodeURI(config.jwt.key))
    // jwt.default.sign({
    //   iss: "luisfelipez@live.com",
    //   exp: new Date().getTime() + 3600 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
    //   additional: "payload"
    // }, config.jwt.key, {
    //   alg: "HS256"
    // }).then(console.log)
    // console.log("************")
    // console.log(cryptoJS.HmacSHA256(header + "." + payload, config.jwt.key).toString())
    // RPnuWpsoSmcUx756a4IXYKD503L3Sk4g1kLZ0Ee_42c
    // jwt.sign({
    //   iss: "luisfelipez@live.com",
    //   exp: new Date().getTime() + 3600 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
    //   additional: "payload"
    // }, config.jwt.key, {
    //   alg: 'HS256'
    // }).then(console.log)
    // console.log(jwt.sign({ id: "id", username: "user" }, 'keyboard cat 4 ever', { expiresIn: 129600 }))

    // console.log(btoa(`{ "alg": "HS256", "typ": "JWT" }`))
    // console.log(cryptoJs.HmacSHA256(base64UrlEncode(`{ "alg": "HS256", "typ": "JWT" }`), config.jwt.key).toString())
    // console.log('-------')
    // console.log(jwtString)
    // this.state.client.auth.loginWithCredential(new CustomCredential(jwtString)).then(user => {
    //   console.log(`Successfully logged in as user ${user.id}`)
    //   this.setState({ currentUserId: user.id })
    // }).catch(err => {
    //   console.log(`Failed to log in anonymously: ${err}`)
    //   this.setState({ currentUserId: undefined })
    // })
  }

  //console.log(base64Encoded("ladies and gentlemen we are floating in space"))
  async signInUser() {
    await this.anonymousLogin()
    if (typeof this.state.currentUserId === 'undefined') {
      return
    }
    const success = await this.loadUser()
    if (success) {
      this.setState({
        signedIn: true
      })
    }
  }

  render() {
    const { navigation } = this.props
    const submitData = navigation.getParam('submitData')

    return this.state.signedIn ?
      <LoggedInScreen
        navigation={this.props.navigation}
        userData={this.state.userData}
        update={this.updateUser}
        client={this.state}
        submitData={submitData}
      /> :
      <LogInScreen
        signIn={this.signInUser}
      />
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
