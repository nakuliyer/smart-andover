import React, { Component } from 'react'
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button
} from 'react-native'
import SmartCard from './SmartCard'
import EcoIcon from './EcoIcon'
import * as Font from 'expo-font'
import truncateNum from '../utilities/truncateNum'
import {
  AwsRequest,
  AwsServiceClient
} from 'mongodb-stitch-react-native-services-aws'
import { RippleLoader } from 'react-native-indicator'
import config from '../../config'

class LoggedInScreen extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    lastUploadedTime: 0,
    submitData: []
  }

  async componentDidMount() {
    await Font.loadAsync({
      'roboto-light': require('../../assets/fonts/roboto/Roboto-Light.ttf'),
      'roboto-medium': require('../../assets/fonts/roboto/Roboto-Medium.ttf')
    })

    const {
      userData: {
        verified
      }
    } = this.props

    this.setState({
      fontLoaded: true,
      verified
    })
  }

  // componentWillUnmount() {
  //   if (this.state.intervalIsSet) {
  //     clearInterval(this.state.intervalIsSet)
  //     this.setState({ intervalIsSet: null })
  //   }
  // }

  // addRecentItem() {
  //   const item = this.state.verified[ 0 ]
  //   const verified = this.state.verified.slice(1)
  //   this.props.update({
  //     $inc: {
  //       'ptsTotal': item.pts,
  //       'co2Total': item.co2,
  //     },
  //     $push: {
  //       'history': item
  //     },
  //     $set: {
  //       'verified': verified
  //     }
  //   })
  //   this.setState({
  //     verified
  //   })
  // }

  // pushToAWS(submitData) {
  //   const { photo, text, ts, meta } = submitData
  //
  //   if (ts - this.state.lastUploadedTime < 20) {
  //     console.log(`Cannot Upload So Soon!`)
  //     return
  //   }
  //
  //   const dupls = this.props.userData.toBeVerified.filter(({ type, ts }) => type === photo ? 'photo' : 'text' && ts === submitData.ts)
  //   if (dupls.length > 0) {
  //     return
  //   }
  //
  //   const combined = [...this.props.userData.history, ...this.props.userData.toBeVerified]
    // if (meta.limit) {
    //   meta.ts = ts
    //   let occurances = []
    //   let rateText = ""
    //   if (meta.limit.rate === 'total') {
    //     occurances = combined.filter(({ id }) => id === meta.id)
    //     rateText = "in total"
    //   } else if (meta.limit.rate === 'week') {
    //     occurances = combined.filter(({ id, ts }) => id === meta.id && meta.ts - ts < 604800)
    //     rateText = "per week"
    //   } else if (meta.limit.rate === 'day') {
    //     occurances = combined.filter(({ id, ts }) => id === meta.id && meta.ts - ts < 86400)
    //     rateText = "per day"
    //   }
    //   if (occurances.length + 1 > meta.limit.times) {
    //     this.props.navigation.navigate('Home', {
    //       submitData: `You can't do that more than ${meta.limit.times} times ${rateText}!`
    //     })
    //     return
    //   }
    // }
  //
  //   const aws = this.props.client.client.getServiceClient(AwsServiceClient.factory, 'ImageSubmissionService')
  //   const bucket = config.aws.bucket
  //
  //   if (photo) {
  //     console.log("Saving Photo....")
  //     const key = `${this.props.client.currentUserId}-${ts}-${meta.id}-photo`
  //     const url = `http://${bucket}.s3.amazonaws.com/${encodeURIComponent(key).replace(/\//g, '-')}`
  //     const contentType = 'img/jpg'
  //
  //     const args = {
  //       ACL: 'public-read',
  //       Bucket: bucket,
  //       ContentType: contentType,
  //       Key: key,
  //       Body: photo.base64
  //     }
  //
  //     const request = new AwsRequest.Builder()
  //       .withService('s3')
  //       .withAction('PutObject')
  //       .withRegion('us-east-1')
  //       .withArgs(args)
  //       .build()
  //
  //     aws.execute(request)
  //       .then(result => {
  //         meta.aws = {
  //           ETag: result.ETag,
  //           VersionId: result.VersionId,
  //           Url: url
  //         }
  //         meta.ts = ts
  //         meta.type = 'photo'
  //         this.props.update({
  //           $push: {
  //             'toBeVerified': meta,
  //             // 'allHistory': {
  //             //   name: meta.name,
  //             //   id: meta.id,
  //             //   pts: meta.pts,
  //             //   co2: meta.co2,
  //             //   limit: meta.limit,
  //             //   ts: meta.ts
  //             // }
  //           }
  //         })
  //         this.props.navigation.navigate('Home', {
  //           submitData: text ? {
  //             text,
  //             ts,
  //             meta
  //           } : 'completed'
  //         })
  //       })
  //       .catch((err) => {
  //         console.log(`Error Uploading to AWS S3 (${err})`)
  //       })
  //   } else if (text) {
  //     console.log("Saving Text....")
  //     const key = `${this.props.client.currentUserId}-${ts}-${meta.id}-text`
  //     const url = `http://${bucket}.s3.amazonaws.com/${encodeURIComponent(key).replace(/\//g, '-')}`
  //     const contentType = 'text/plain'
  //
  //     const args = {
  //       ACL: 'public-read',
  //       Bucket: bucket,
  //       ContentType: contentType,
  //       Key: key,
  //       Body: text
  //     }
  //
  //     const request = new AwsRequest.Builder()
  //       .withService('s3')
  //       .withAction('PutObject')
  //       .withRegion('us-east-1')
  //       .withArgs(args)
  //       .build()
  //
  //     aws.execute(request)
  //       .then(result => {
  //         meta.aws = {
  //           ETag: result.ETag,
  //           VersionId: result.VersionId,
  //           Url: url
  //         }
  //         meta.ts = ts
  //         meta.type = 'text'
  //         this.props.update({
  //           $push: {
  //             'toBeVerified': meta,
  //             // 'allHistory': {
  //             //   name: meta.name,
  //             //   id: meta.id,
  //             //   pts: meta.pts,
  //             //   co2: meta.co2,
  //             //   limit: meta.limit,
  //             //   ts: meta.ts
  //             // }
  //           }
  //         })
  //         this.props.navigation.navigate('Home', {
  //           submitData: photo ? {
  //             photo,
  //             ts,
  //             meta
  //           } : 'completed'
  //         })
  //         // this.setState({
  //         //   submitData: [ ...submitData, meta ]
  //         // })
  //         // this.props.update({
  //         //   $push: {
  //         //     'toBeVerified': meta
  //         //   }
  //         // })
  //         // this.props.navigation.navigate('Home', { submitData: null })
  //       })
  //       .catch((err) => {
  //         console.log(`Error Uploading to AWS S3 (${err})`)
  //       })
  //   }
  // }

  render() {
    const {
      userData: {
        ptsToday,
        ptsTotal,
        co2Total,
        name
      },
      navigation: {
        navigate
      },
      client,
      submitData
    } = this.props

    if (submitData && typeof submitData !== 'string') {
      this.pushToAWS.bind(this)(submitData)
    }

    const { verified } = this.state

    const ptsTodayExpected = 10
    const funFact = config.funFacts[ Math.floor(Math.random() * config.funFacts.length) ]

    let dailyGoal = ptsToday / ptsTodayExpected
    if (dailyGoal > 1) {
      dailyGoal = 1
    }

    // var dailyGoalString = String(dailyGoal * 100) + '%'

    if (!this.state.fontLoaded) return null

    return (
      <View style={styles.container}>
        {verified.length > 0 && <View style={styles.overlayContainer}>
          <SmartCard style={styles.overlay}>
            <Text style={styles.pointsAwardedText}>You
                                                   got {verified[ 0 ].pts} points
                                                   for:</Text>
            <Text />
            <Text style={styles.pointsAwardedNumber}>{verified[ 0 ].name}</Text>
            <Text />
            <Button
              title={'Continue'}
              onPress={this.addRecentItem.bind(this)}
            />
          </SmartCard>
        </View>}
        {submitData && submitData !== 'completed' &&
        <View style={styles.overlayContainer}>
          <SmartCard style={styles.overlay}>
            <Text style={styles.pointsAwardedText}>{typeof submitData === 'string' ? submitData : 'Uploading Submission...'}</Text>
            <Text />
            {typeof submitData === 'string' ? <Button
              title={'Continue'}
              onPress={() => navigate('Home', { submitData: null })}
            /> : <RippleLoader />}
            <Text />
          </SmartCard>
        </View>}
        <View style={{ opacity: verified.length > 0 || (submitData && submitData !== 'completed') ? 0.1 : 1 }}>
          <StatusBar barStyle="default" />
          <Text />
          <SmartCard>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.ptsBox}>
                <Text style={styles.ptsText}>{truncateNum(ptsTotal, 'integer')}</Text>
                <Text style={styles.ptsLabel}>Total Points</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.ptsBox}>
                <Text style={styles.ptsText}>{truncateNum(co2Total, 'double')}</Text>
                <Text style={styles.ptsLabel}>Total CO{'\u2082'} Saved</Text>
              </View>
            </View>
            <Text style={styles.greetingText}>Welcome to the Smart Andover
                                              App, {name}!</Text>
          </SmartCard>
          <SmartCard>
            <View>
              <Text style={styles.funFactLabel}>
                {'Fun Fact: '}
                <Text
                  style={styles.funFact}
                >{funFact}</Text>
              </Text>
            </View>
          </SmartCard>
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'eat',
                c: config.top,
                client: client
              })}
            >
              <EcoIcon
                c={config.top}
                name={'Eat'}
                img={require('../../assets/eco-icons/eat.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'drink',
                c: config.top,
                client: client
              })}
            >
              <EcoIcon
                c={config.top}
                name={'Drink'}
                img={require('../../assets/eco-icons/drink.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'clean',
                c: config.top,
                client: client
              })}
            >
              <EcoIcon
                c={config.top}
                name={'Clean'}
                img={require('../../assets/eco-icons/clean.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'reduce',
                c: config.mid,
                client: client
              })}
            >
              <EcoIcon
                c={config.mid}
                name={'Reduce'}
                img={require('../../assets/eco-icons/reduce.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'reuse',
                c: config.mid,
                client: client
              })}
            >
              <EcoIcon
                c={config.mid}
                name={'Reuse'}
                img={require('../../assets/eco-icons/reuse.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'recycle',
                c: config.mid,
                client: client
              })}
            >
              <EcoIcon
                c={config.mid}
                name={'Recycle'}
                img={require('../../assets/eco-icons/recycle.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'innovate',
                c: config.bot,
                client: client
              })}
            >
              <EcoIcon
                c={config.bot}
                name={'Innovate'}
                img={require('../../assets/eco-icons/innovate.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'energy',
                c: config.bot,
                client: client
              })}
            >
              <EcoIcon
                c={config.bot}
                name={'Energy'}
                img={require('../../assets/eco-icons/share.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('Submission', {
                type: 'engage',
                c: config.bot,
                client: client
              })}
            >
              <EcoIcon
                c={config.bot}
                name={'Engage'}
                img={require('../../assets/eco-icons/support.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
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
  }
})

export default LoggedInScreen
