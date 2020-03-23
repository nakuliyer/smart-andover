import React, { Component } from 'react'
const { Button, StyleSheet, Text, TextInput, View } = require('react-native');
const { Stitch, AnonymousCredential, RemoteMongoClient } = require('mongodb-stitch-react-native-sdk');
const MongoDB = require('mongodb-stitch-react-native-services-mongodb-remote');


class StitchClient extends Component {
  constructor(props) {
    super(props);
    this.state={
      currentUserId: undefined,
      client: undefined,
      atlasClient: undefined,
      db: undefined,
      collection: undefined,
      tempName: undefined,
      name: undefined,
      welcomeText: undefined
    };
    this._loadClient = this._loadClient.bind(this);
    this._onPressLogin = this._onPressLogin.bind(this);
    this._onPressLogout = this._onPressLogout.bind(this);
    this._onPressName = this._onPressName.bind(this);
  }

  componentDidMount() {
    this._loadClient();
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('smartandover-wygyl').then(client => {
      this.setState({ client });
      const dbClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
      this.setState({atlasClient : dbClient});
      this.setState({db : dbClient.db("StitchDB")});
      if(client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id })
      }
    });
  }

  _onPressLogin() {
    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        console.log(`Successfully logged in as user ${user.id}`);
        this.setState({ currentUserId: user.id })
    }).catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined })
    });
  }

  _onPressLogout() {
    this.state.client.auth.logout().then(user => {
        console.log(`Successfully logged out`);
        this.setState({tempName: undefined})
        this.setState({name: undefined})
        this.setState({currentUserId: undefined})
        this.setState({welcomeText: undefined})
        this.setState({tempName: undefined})
    }).catch(err => {
        console.log(`Failed to log out: ${err}`);
        this.setState({ currentUserId: undefined })
    });
  }

  _onPressName() {
      this.setState({ name: this.state.tempName });
      const collection = this.state.db.collection("names");
      collection.find({owner_id: this.state.currentUserId}, {limit: 1}).first().then(foundDoc => {
        if (foundDoc) {
          collection.updateOne(
            {owner_id: this.state.currentUserId},
            {owner_id: this.state.currentUserId, name: this.state.tempName}).then(result => {
                this.state.client.callFunction("welcome").then(welcomeMessage => {
                this.setState({welcomeText: welcomeMessage});
              })
            })
        } else {
          collection.insertOne(
          {owner_id: this.state.currentUserId,
           name: this.state.tempName}).then(result => {
                this.state.client.callFunction("welcome").then(welcomeMessage => {
                this.setState({welcomeText: welcomeMessage});
              })
            })
        }
      })
  }

  render() {
    let loginStatus = "Currently logged out."

    if(this.state.currentUserId) {
      loginStatus = `Currently logged in as ${this.state.currentUserId}!`
    }

    const loginButton = <Button
                    onPress={this._onPressLogin}
                    title="Login"/>

    const logoutButton = <Button
                    onPress={this._onPressLogout}
                    title="Logout"/>
    const nameInput = <TextInput
                  placeholder="Type your name here..."
                  onChangeText={(text) => this.setState({tempName: text})}/>
    const confirmNameButton = <Button
                          onPress={this._onPressName}
                          title="Confirm Name"
                        />

    return (
      <View style={styles.container}>
        <Text> {loginStatus} </Text>
        <View>{this.state.currentUserId !== undefined ? logoutButton : loginButton}</View>
        <Text>{this.state.name !== undefined ? this.state.welcomeText : this.state.currentUserId !== undefined ? nameInput : ""}</Text>
        <Text>{(this.state.name == undefined) && (this.state.tempName !== undefined) ? confirmNameButton : "" }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StitchClient