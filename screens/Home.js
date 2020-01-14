import React, { Component } from "react";
import { View, SafeAreaView, Button, Alert, Text } from "react-native";

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Button as StyledButton } from 'native-base';

import how_it_works from './how_it_works';
import help from "./help";
import order_history from './order_history';
import KG_Services from "./KG_Services";
import MyNativeMap from "./MyNativeMap";
import Map from "./map";

import about from './about';
import deviceStorage from '../services/deviceStorage.js';
import Auth from "./Auth";
import PlaceOrder from "./place_order";
import ChildService from "./ChildService";
export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jwt: 'aa',
    }
    this.logout = this.logout.bind(this);


  }
  logout() {
    console.log('logout')
  }
  render() {
    return (
      <MAppContainer jwt="aaa" />
    )

  }
}
const AuthStack = createStackNavigator(
  {
    SignIn: {
      screen: () => <Auth />
    },
  },
  {
    headerMode: 'none',
  }
);
const ServicesStack = createStackNavigator(
  {
    Home: { screen: KG_Services },
    PlaceOrder: { screen: PlaceOrder },
    ChildService: { screen: ChildService },
    MyNativeMap: { screen: Map }
  },
  {
    headerMode: 'none',
  }
);
const AppStack = createDrawerNavigator({
  "Services": ServicesStack,
  // "How It Works": { screen: how_it_works },
  "Order History": { screen: order_history },
  // Notifications: { screen: notifications },
  // Packages: { screen: packages },

  // "About": { screen: about },
  "Contact": { screen: help },
  // Logout: { screen: help },
}, {
  drawerWidth: 300,
  drawerPosition: "left",
  initialRouteName: "Services",
  contentOptions: {

    activeLabelStyle: {
      fontSize: 16,
      color: "#ffca08",
    }
  },
  contentComponent: (props) => (
    <View style={{ flex: 1 }}>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems {...props} />
        <StyledButton style={{ backgroundColor: "#ffca08", justifyContent: "center", alignItems: "center" }}
          onPress={() => {
            console.log(props);
            Alert.alert(
              'Log out',
              'Do you want to logout?',
              [
                { text: 'Cancel', onPress: () => { return null } },
                {
                  text: 'Confirm', onPress: () => {
                    deviceStorage.logMeOut().then(() => {

                      props.navigation.navigate('Auth');
                      console.log("bb");
                    });

                  }
                },
              ],
              { cancelable: false }
            )


          }}>
          <Text>Logout</Text>
        </StyledButton>
        {/* <Button style={{ fontColor: "#000" }} textColor="#000" color="#ffca08" title="Logout" onPress={() => {
          console.log(props);
          Alert.alert(
            'Log out',
            'Do you want to logout?',
            [
              { text: 'Cancel', onPress: () => { return null } },
              {
                text: 'Confirm', onPress: () => {
                  deviceStorage.logMeOut().then(() => {

                    props.navigation.navigate('Auth');
                    console.log("bb");
                  });

                }
              },
            ],
            { cancelable: false }
          )


        }} /> */}
      </SafeAreaView>
    </View>
  ),
});
const MAppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Auth: AuthStack,
      Services: ServicesStack,
    },
    {
      initialRouteName: 'App'
    }
  )
);

