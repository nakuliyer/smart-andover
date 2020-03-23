import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  View,
  Button,
  Platform,
  base64encoded,
	Animated,
	Dimensions,
	PixelRatio,
  KeyboardAvoidingView
} from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'
import * as Expo from 'expo'
import * as Font from 'expo-font'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import config from '../../config'
import SmartCard from './SmartCard'
import LogoTitle from './LogoTitle'

class LogInScreen extends Component {
  constructor() {
    super(...arguments)

    this.state = {
      fontLoaded: false,
      helpScreen: 0,
      andoverEmail: '',
      password: '',
      confirmPassword: '',
      errorMsg: '',
			slideLeft: new Animated.Value(0),
			inAnimation: false
    }

    this.signUp = this.signUp.bind(this);
    this.login = this.login.bind(this);
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      center: <LogoTitle />,
      left: null,
      right: null
    })

    await Font.loadAsync({
      'roboto-light': require('../../assets/fonts/roboto/Roboto-Light.ttf'),
      'roboto-medium': require('../../assets/fonts/roboto/Roboto-Medium.ttf')
    })

    this.setState({ fontLoaded: true })
  }

  signUp() {
    // quick validation
		if (!this.state.andoverEmail || !this.state.password.length || !this.state.confirmPassword.length) {
			this.setState({
				errorMsg: 'Some boxes aren\'t filled'
			})
			return
		}
    if (!this.state.andoverEmail.endsWith('@andover.edu')) {
      this.setState({
        errorMsg: 'Your password must end with \'@andover.edu\''
      })
      return
    }
    if (this.state.password.length < 8) {
      this.setState({
        errorMsg: 'Make your password at least 8 characters long.'
      })
      return
    }
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errorMsg: 'Those two passwords don\'t match. Try again!'
      })
      return
    }
    this.setState({
      errorMsg: ''
    })

    axios.post(config.api + 'users/register', {
      email: this.state.andoverEmail.toLowerCase(),
      username: this.state.andoverEmail.toLowerCase().substring(0, this.state.andoverEmail.indexOf('@')),
      password: this.state.password
    })
      .then((res) => {
        this.props.authorize(res.headers['auth-token'])
      })
      .catch((res) => {
        this.setState({
          errorMsg: res.response.data || 'There was a network error. Try again later :('
        })
      });
  }

  login() {
    axios.post(config.api + 'users/login', {
      email: this.state.andoverEmail.toLowerCase(),
      password: this.state.password
    })
      .then((res) => {
        const e = SecureStore.setItemAsync('SmartAndoverEmail', this.state.andoverEmail.toLowerCase()).then(() => {})
        const p = SecureStore.setItemAsync('SmartAndoverPassword', this.state.password).then(() => {})
        this.props.authorize(res.headers['auth-token'])
      })
      .catch((res) => {
        this.setState({
          errorMsg: res.response.data || 'There was a network error. Try again later :('
        })
      });
  }

	getHowToTitle() {
		if (this.state.helpScreen < 3) {
			return <Text style={styles.howToTitle}>Here's how it works!</Text>
		} else if (this.state.helpScreen === 3) {
			return <Text style={styles.howToTitle}>Sign Up</Text>
		}
		return <Text style={styles.howToTitle}>Log In</Text>
	}

	swipeLeft = () => {
		if (!this.state.inAnimation && this.state.helpScreen < 4) {
			this.setState({
				inAnimation: true,
				helpScreen: this.state.helpScreen += 1,
        errorMsg: ''
			})
			Animated.timing(this.state.slideLeft, {
				toValue: -this.state.helpScreen*Dimensions.get('window').width,
	      duration: 500
	    }).start(() => {
				this.setState({
					inAnimation: false
				})
			})
		}
	}

	swipeRight = () => {
		if (!this.state.inAnimation && this.state.helpScreen === 4) {
			this.setState({
				inAnimation: true,
				helpScreen: this.state.helpScreen -= 1,
        errorMsg: ''
			})
			Animated.timing(this.state.slideLeft, {
				toValue: -this.state.helpScreen*Dimensions.get('window').width,
	      duration: 500
	    }).start(() => {
				this.setState({
					inAnimation: false
				})
	    });
		}
	}

  render() {
    const {
      signIn
    } = this.props

    let {
      helpScreen
    } = this.state
    if (!this.state.fontLoaded) return null

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <SmartCard style={styles.card}>
          <View>
            <Text style={styles.title}>
              <Text>Welcome to the Smart</Text>
              <Text style={{ color: config.theme }}>Andover</Text>
              <Text> App</Text>
            </Text>
            <Text />

						{this.getHowToTitle()}
            <View style={styles.horizBar} />

            <GestureRecognizer
							onSwipeRight={this.swipeRight}
              onSwipeLeft={this.swipeLeft}
            >
							<Animated.View
								style={[styles.infoPanelContainer, {
												transform: [
													{translateX: this.state.slideLeft},
													{perspective: 1000}
												]
								}]}
							>
								<View style={styles.infoPanelFlexBox}>
									<View style={styles.infoPanel}>
										<Image
							  			source={require('../../assets/ui/intro/recycling.png')}
							  			style={styles.howToImages}
										/>
										<Text />
										<Text style={styles.howToDescription}>First, do something to
							                                      			help the
							                                      			environment.</Text>
										<Text />
									</View>
									<View style={styles.infoPanel}>
						        <Image
						          source={require('../../assets/ui/intro/takePhoto.png')}
						          style={styles.howToImages}
						        />
						        <Text />
						        <Text style={styles.howToDescription}>Then, upload a photo of yourself
						                                              doing it to this app under the
						                                              right category.</Text>
						        <Text />
						      </View>
									<View style={styles.infoPanel}>
						        <Image
						          source={require('../../assets/ui/intro/money.jpg')}
						          style={styles.howToImages}
						        />
						        <Text />
						        <Text style={styles.howToDescription}>Earn points once we verify your
						                                              submissions, and trade these
						                                              points in for cash and gift
						                                              cards!</Text>
						        <Text />
						      </View>
									<View style={styles.infoPanel}>
										{this.state.errorMsg ? <Text style={[styles.howToDescription, {marginBottom: 20, color: 'red'}]}>{this.state.errorMsg}</Text> : null}
						        <Text style={styles.providersTitle}>Andover Email</Text>
						        <TextInput
						          style={styles.textBoxes}
						          onChangeText={text => this.setState({
						            andoverEmail: text
						          })}
						          value={this.state.andoverEmail}
						          keyboardType={'email-address'}
						        />
						        <Text style={styles.providersTitle}>Password</Text>
						        <TextInput
						          style={styles.textBoxes}
						          onChangeText={text => this.setState({
						            password: text
						          })}
						          value={this.state.password}
						          secureTextEntry
						        />
						        <Text style={styles.providersTitle}>Confirm Password</Text>
						        <TextInput
						          style={styles.textBoxes}
						          onChangeText={text => this.setState({
						            confirmPassword: text
						          })}
						          value={this.state.confirmPassword}
						          secureTextEntry
						        />
						        <Text />
						        <Button style={styles.howToDescription} title={'Continue'} onPress={this.signUp}/>
						        <Text />
						      </View>
									<View style={styles.infoPanel}>
                    {this.state.errorMsg ? <Text style={[styles.howToDescription, {marginBottom: 20, color: 'red'}]}>{this.state.errorMsg}</Text> : null}
						        <Text style={styles.providersTitle}>Andover Email</Text>
						        <TextInput
						          style={styles.textBoxes}
						          onChangeText={text => this.setState({
						            andoverEmail: text
						          })}
						          value={this.state.andoverEmail}
						          keyboardType={'email-address'}
						        />
						        <Text style={styles.providersTitle}>Password</Text>
						        <TextInput
						          style={styles.textBoxes}
						          onChangeText={text => this.setState({
						            password: text
						          })}
						          value={this.state.password}
						          secureTextEntry
						        />
						        <Text />
						        <Button
                      style={styles.howToDescription}
                      title={'Continue'}
                      onPress={this.login}
                    />
						        <Text />
						      </View>
								</View>
							</Animated.View>
            </GestureRecognizer>
            <Text
              style={styles.swipeHelp}
            >{
              helpScreen < 3 && 'Swipe Left to Continue' ||
              helpScreen === 3 && 'Swipe Left to Log In' ||
              helpScreen === 4 && 'Swipe Right to Sign Up'
            }</Text>
          </View>
        </SmartCard>
      </KeyboardAvoidingView>
    )
  }
}

const
  styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    card: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      width: 300,
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: '600',
      fontFamily: 'roboto-light'
    },
    providersTitle: {
      fontFamily: 'roboto-medium',
      textAlign: 'center'
    },
    providersHelp: {
      textAlign: 'center',
      fontSize: 10
    },
    howToTitle: {
      fontFamily: 'roboto-medium',
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 20
    },
    howToDescription: {
      fontFamily: 'roboto-light',
      textAlign: 'center',
      fontSize: 17
    },
    horizBar: {
      width: 200,
      height: 5,
      borderRadius: 15,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      marginTop: 10,
      marginBottom: 20,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    providersContainer: {
      flex: 1,
      flexDirection: 'row',
      maxHeight: 100,
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    providerContainer: {
      flexDirection: 'column'
    },
    providersLabel: {
      textAlign: 'center',
      fontFamily: 'roboto-light'
    },
    forwardsArrow: {
      width: 30,
      height: 30,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    howToImages: {
      width: 150,
      height: 150,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    swipeHelp: {
      fontStyle: 'italic',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    textBoxes: {
      height: 30,
      borderColor: 'rgba(0, 0, 0, 0.3)',
      borderWidth: 1,
      borderRadius: 2,
      width: 200,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 5,
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'roboto-light'
    },
		infoPanelContainer: {
			left: Dimensions.get('window').width * 2,
		},
		infoPanelFlexBox: {
			display: 'flex',
			flexDirection: 'row'
		},
		infoPanel: {
			width: Dimensions.get('window').width,
			paddingLeft: 30,
			paddingRight: 30,
			marginTop: "auto",
			marginBottom: "auto"
		}
  })

export default LogInScreen
