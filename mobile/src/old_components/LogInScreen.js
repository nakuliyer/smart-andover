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
	PixelRatio
} from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'
import { SocialIcon } from 'react-native-elements'
import * as Expo from 'expo'
import * as Font from 'expo-font'
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  CustomCredential
} from 'mongodb-stitch-react-native-sdk'

import LogoTitle from './LogoTitle'
import config from '../../config'
import SmartCard from './SmartCard'
import JWT from 'expo-jwt';

class LogInScreen extends Component {
  constructor() {
    super(...arguments)

    this.state = {
      client: undefined,
      fontLoaded: false,
      helpScreen: 0,
      andoverEmail: '',
      password: '',
      confirmPassword: '',
      errorMsg: '',
			slideLeft: new Animated.Value(0),
			inAnimation: false
    }

    this._loadClient = this._loadClient.bind(this)
    this.addUser = this.addUser.bind(this)
    this.signUp = this.signUp.bind(this)
    console.log(JWT.encode({ aud: config.jwt.aud }, config.jwt.key, { algorithm: 'HS256' }))
  }

  static navigationOptions = {
    headerTitle: <LogoTitle />,
    // headerRight: <ProfileIcon />
  }

  async componentDidMount() {
    await Font.loadAsync({
      'roboto-light': require('../../assets/fonts/roboto/Roboto-Light.ttf'),
      'roboto-medium': require('../../assets/fonts/roboto/Roboto-Medium.ttf')
    })

    this.setState({ fontLoaded: true })
    console.log('Mounted')
  }

	/* Only for Development */
  async anonymousLogin() {
    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`Successfully logged in as user ${user.id}`)
      this.setState({ currentUserId: user.id })
    }).catch(err => {
      console.log(`Failed to log in anonymously: ${err}`)
      this.setState({ currentUserId: undefined })
    })
  }

  async addUser() {
    this.state.collection.find({ owner_id: this.state.currentUserId }, { limit: 1 }).first().then(foundDoc => {
      if (foundDoc) {
        this.state.collection.updateOne(
          { owner_id: this.state.currentUserId },
          {
            owner_id: this.state.currentUserId,
            name: this.state.tempName
          }).then(result => {
          console.log(result)
        })
      } else {
        this.state.collection.insertOne(
          {
            owner_id: this.state.currentUserId,
            name: this.state.tempName
          }).then(result => {
          console.log(result)
        })
      }
    })
  }

  _loadClient() {
    const APP_ID = 'smartandover-wygyl'

    // TODO: Initialize the app client
    const app = Stitch.hasAppClient(APP_ID)
      ? Stitch.getAppClient(APP_ID)
      : Stitch.initializeAppClient(APP_ID)

    app.then(client => {
      this.setState({ client })
      const dbClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
      this.setState({ atlasClient: dbClient })
      this.setState({ collection: dbClient.db('StitchDB').collection('users_information') })
    })
  }

  componentWillMount() {
    this._loadClient()
  }

  signUp() {
		if (this.state.andoverEmail === "" || this.state.password.length === 0 || this.state.confirmPassword.length === 0) {
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

		// do stuff
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
				helpScreen: this.state.helpScreen += 1
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
				helpScreen: this.state.helpScreen -= 1
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
      <View
        style={styles.container}
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
							  			source={require('../../assets/ui/recycling.png')}
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
						          source={require('../../assets/ui/takePhoto.png')}
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
						          source={require('../../assets/ui/money.jpg')}
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
						        <Button style={styles.howToDescription} title={'Continue'} onPress={this.props.signIn}/>
						        <Text />
						      </View>
								</View>
							</Animated.View>
            </GestureRecognizer>
            <Text style={styles.swipeHelp}>{helpScreen < 3 && 'Swipe Left to Continue' || helpScreen === 3 && 'Swipe Left to Log In' || helpScreen === 4 && 'Swipe Right to Sign Up'}</Text>
            {/*<Text style={styles.providersTitle}>
              Login with the following providers:
            </Text>
            <View
              style={styles.providersContainer}
            >
              <View style={styles.providerContainer}>
                <SocialIcon
                  type="google-plus-official"
                  onPress={this.googleIconPressed}
                />
                <Text style={styles.providersLabel}>Google</Text>
              </View>
              <View style={styles.providerContainer}>
                <SocialIcon
                  type="facebook"
                  onPress={() => {
                    console.log('facebook')
                  }}
                />
                <Text style={styles.providersLabel}>Facebook</Text>
              </View>
            </View>
            <Button
              title={'Login Anonymously (Beta)'}
              onPress={this.props.signIn}
            />*/}
          </View>
        </SmartCard>
      </View>
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
      fontStyle: 'italics',
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
