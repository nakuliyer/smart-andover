import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./src/components/HomeScreen";
import Profile from "./src/components/Profile";
import Submission from "./src/components/Submission";
import CameraView from "./src/components/CameraView"

// TODO:
// 1) Figure out Server Stuff
// 2) Make Config Public
// 3) Figure out Login Stuff
// 4) Clean Up Assets Folder

const AppNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
	Profile: { screen: Profile },
	Submission: { screen: Submission },
	Camera: { screen: CameraView }
});

export default createAppContainer(AppNavigator)
