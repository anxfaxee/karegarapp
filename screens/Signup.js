import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import PhoneRegistration from '../components/PhoneRegistration';

export default class Signup extends Component {


  render() {
    return (
      <View style={styles.container}>
        <PhoneRegistration navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: "#f5f5f5",
  }
});
