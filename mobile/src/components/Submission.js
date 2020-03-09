import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import RadioButton from './RadioButton'
import SmartCard from './SmartCard'
import * as Expo from 'expo'
import { Camera } from 'expo-camera'
import CameraView from './CameraView'
import * as Font from 'expo-font'

import config from '../../config.json'

class Submission extends Component {
  state = {
    fontLoaded: false,
    checked: -1,
    text: ''
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: config.ecoIcons[ navigation.getParam('type') ].title
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'roboto-light': require('../../assets/fonts/roboto/Roboto-Light.ttf'),
      'roboto-medium': require('../../assets/fonts/roboto/Roboto-Medium.ttf')
    })
    this.setState({
      fontLoaded: true
    })
  }

  render() {
    const { navigation } = this.props
    const { navigate } = navigation
    const type = navigation.getParam('type')
    const c = navigation.getParam('c')
    const client = navigation.getParam('client')

    if (!this.state.fontLoaded) return null

    const useCamera = this.state.checked > -1 ? config.ecoIcons[ type ].opts[ this.state.checked ].verifyImg : false
    const useText = this.state.checked > -1 ? config.ecoIcons[ type ].opts[ this.state.checked ].verifyText : false

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={styles.container}>
            <StatusBar barStyle="default" />
            <Text />
            <View style={styles.inner}>
              <SmartCard style={styles.tableCard}>
                <ScrollView style={styles.table}>
                  <View style={[ styles.tr, { backgroundColor: 'rgba(0, 0, 255, 0.1)' } ]}>
                    <Text style={styles.td0}></Text>
                    <View style={styles.divider} />
                    <Text style={styles.td1}></Text>
                    <View style={styles.divider} />
                    <Text style={styles.td2}>Points</Text>
                    <View style={styles.divider} />
                    <Text style={styles.td3}>CO{'\u2082'} Saved</Text>
                  </View>
                  {config.ecoIcons[ type ].opts.map(({ name, pts, co2 }, i) =>
                    <View
                      style={{ display: 'flex', flexDirection: 'column' }}
                      key={name}
                    >
                      <View style={styles.horizBar} />
                      <View style={[ styles.tr, { backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.03)' } ]}>
                        <View style={styles.td0}>
                          <TouchableOpacity
                            onPress={() => {
                              // if (this.state.checked === i) {
                              //   this.setState({
                              //     checked: -1
                              //   })
                              // } else {
                              this.setState({
                                checked: i
                              })
                              // }
                            }}
                          >
                            <RadioButton
                              style={{
                                marginLeft: 'auto',
                                marginRight: 'auto'
                              }}
                              selected={() => this.state.checked === i}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />
                        <Text style={styles.td1}>{name}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.td2}>{pts > 0 ? '+' : ''}{pts}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.td3}>{co2}</Text>
                      </View>
                    </View>
                  )}</ScrollView>
              </SmartCard>
              <SmartCard>
                <Text style={{ fontFamily: 'roboto-light' }}>{config.ecoIcons[ type ].desc}</Text>
              </SmartCard>
              {useText && <SmartCard>
                <TextInput
                  style={{
                    height: 40,
                    width: '100%',
                    borderColor: 'gray',
                    borderWidth: 1
                  }}
                  onChangeText={(text) => this.setState({ text })}
                  value={this.state.text}
                />
              </SmartCard>}
              {this.state.checked === -1 || (useText && this.state.text === '') ?
                <SmartCard
                  color={'rgba(0, 0, 0, 0.05)'}
                  style={styles.cameraCard}
                >
                  <View
                    style={styles.cameraView}
                  >
                    <Text style={[ styles.cameraText, { color: 'rgba(0, 0, 0, 0.3)' } ]}>Submit
                                                                                         Action</Text>
                  </View>
                </SmartCard> :
                <TouchableOpacity onPress={() => useCamera ? navigate('Camera', {
                  client: client,
                  text: this.state.text,
                  ecoType: config.ecoIcons[ navigation.getParam('type') ].title,
                  ecoMeta: config.ecoIcons[ navigation.getParam('type') ].opts[this.state.checked]
                }) : navigate('Home', {
                  submitData: {
                    photo: null,
                    text: this.state.text,
                    ts: Math.floor(Date.now() / 1000),
                    meta: config.ecoIcons[ navigation.getParam('type') ].opts[this.state.checked]
                  }
                })}>
                  <SmartCard
                    color={'rgba(0, 0, 255, 0.1)'}
                    style={styles.cameraCard}
                  >
                    <View
                      style={styles.cameraView}
                    >
                      {useCamera && <Image
                        source={require('../../assets/eco-icons/camera.png')}
                        style={[ styles.cameraImg, { opacity: 0.7 } ]}
                      />}
                      {useText && <Image
                        source={require('../../assets/eco-icons/compose.png')}
                        style={[ styles.cameraImg, { opacity: 0.7 } ]}
                      />}
                      <Text style={[ styles.cameraText, { color: 'rgba(0, 0, 0, 0.7)' } ]}>Submit
                                                                                           Action</Text>
                    </View>
                  </SmartCard>
                </TouchableOpacity>
              }
              <View style={{ flex : 1 }} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  divider: {
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  horizBar: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  table: {
    overflow: 'scroll',
    maxHeight: 300
  },
  tableCard: {},
  tr: {
    flexDirection: 'row',
    minHeight: 30
  },
  td0: {
    width: '10%',
    fontFamily: 'roboto-light',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: 5,
    paddingBottom: 5
  },
  td1: {
    width: '45%',
    textAlign: 'center',
    fontFamily: 'roboto-light',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 5,
    marginRight: 5
  },
  td2: {
    width: '15%',
    textAlign: 'center',
    fontFamily: 'roboto-light',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  td3: {
    width: '25%',
    textAlign: 'center',
    fontFamily: 'roboto-light',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  cameraCard: {
    height: 30
  },
  cameraView: {
    display: 'flex',
    flexDirection: 'row'
  },
  cameraImg: {
    height: 30,
    width: 30,
    marginRight: 3,
  },
  cameraText: {
    fontFamily: 'roboto-medium',
    fontSize: 18,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 3
  }
})

export default Submission