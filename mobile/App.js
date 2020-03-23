import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./src/components/HomeScreen";
import ProfileMenu from "./src/components/ProfileMenu";
import SettingsMenu from "./src/components/SettingsMenu";
import HelpMenu from "./src/components/HelpMenu";
import Submission from "./src/components/Submission";
import CameraView from "./src/components/CameraView"

const AppNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
	ProfileMenu: { screen: ProfileMenu },
  SettingsMenu: { screen: SettingsMenu },
  HelpMenu: { screen: HelpMenu },
	Submission: { screen: Submission },
	Camera: { screen: CameraView }
});

export default createAppContainer(AppNavigator)
