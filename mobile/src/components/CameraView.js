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

class CameraView extends Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    client: null
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
      client: navigation.getParam('client'),
      text: navigation.getParam('text'),
      ecoType: navigation.getParam('ecoType'),
      ecoMeta: navigation.getParam('ecoMeta')
    })
  }

  async snapPhoto() {
    if (this.camera) {
      const options = {
        quality: 1, base64: true, fixOrientation: false,
        exif: true
      }
      await this.camera.takePictureAsync(options).then(photo => {
        photo.exif.Orientation = 1
        this.props.navigation.navigate('Home', {
          submitData: {
            photo: photo,
            text: this.state.text !== '' ? this.state.text : null,
            ts: Math.floor(Date.now() / 1000),
            meta: this.state.ecoMeta
          }
        })
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
                  source={require('../../assets/eco-icons/back.png')}
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