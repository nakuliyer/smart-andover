import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image
} from 'react-native'
import * as Expo from 'expo'
import { Camera } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
// import RNFetchBlob from 'react-native-fetch-blob'

import config from '../../config'

class CameraView extends Component {
  constructor(props) {
    super(props);

    this.snapPhoto = this.snapPhoto.bind(this);
  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    client: null,
    snapped: false
  }

  static navigationOptions = {
    header: null
  }

  async componentDidMount() {
    const { navigation } = this.props

    const { Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted',
      text: navigation.getParam('text'),
      meta: navigation.getParam('meta')
    })
  }

  async snapPhoto() {
    if (this.camera && !this.state.snapped) {
      this.setState({
        snapped: true
      })
      const photo = await this.camera.takePictureAsync({ fixOrientation: false })
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 108, height: 192 } }],
        { compress: 0, format: "png", base64: true }
      )

      await axios.post(config.api + 'activities/add', {
        photo: resizedPhoto.base64,
        textInput: this.state.text !== '' ? this.state.text : null,
        metaId: this.state.meta.id,
        metaPts: this.state.meta.pts,
        metaCO2: this.state.meta.co2,
        metaLimitTimes: this.state.meta.limit.times,
        metaLimitRate: this.state.meta.limit.rate,
        metaName: this.state.meta.name,
        metaVerifyImage: this.state.meta.verifyImg,
        metaVerifyText: this.state.meta.verifyText,
        metaCategory: this.props.navigation.getParam('typeId')
      })

      this.props.navigation.navigate('Home', {
        submitData: true
      })
    }
  }

  render() {
    const { navigation } = this.props
    const { goBack } = navigation
    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar hidden={true} />
          <Camera
            ref={(ref) => {
              this.camera = ref
            }}
            style={{ flex: 1 }}
            type={this.state.type}
          >
            <View
              style={styles.bottomBar}
            >
              <TouchableOpacity onPress={() => goBack(null)}>
                <Image
                  source={require('../../assets/ui/camera/back.png')}
                  style={styles.backButtonImg}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.snapPhoto.bind(this)}
                style={styles.clickOpacity}
              >
                <View style={styles.clickButton} />
              </TouchableOpacity>
            </View>
            {/*<View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: 'white'
                  }}
                > Flip </Text>
              </TouchableOpacity>
            </View>*/}
          </Camera>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    height: 100,
    marginTop: 'auto',
    width: 300,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  clickOpacity: {
    width: 70,
    height: 70,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  clickButton: {
    width: 70,
    height: 70,
    borderWidth: 4,
    borderRadius: 35,
    borderColor: 'white'
  },
  backButtonImg: {
    width: 50,
    height: 50,
    marginRight: 'auto',
    position: 'absolute',
    marginTop: 8,
    zIndex: 300
  }
})

export default CameraView
