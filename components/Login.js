import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { Input, TextLink, Loading } from './common';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';
import PhoneInput from 'react-native-phone-input';
import { Item, Input as MyInput, Icon, Button as StyledButton } from 'native-base';

import { TouchableOpacity } from 'react-native-gesture-handler';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      password: '',
      error: '',
      loading: false
    };
    this.loginUser = this.loginUser.bind(this);
    this.onLoginFail = this.onLoginFail.bind(this);
  }
  static navigationOptions = {
    title: 'Please sign in',
  };
  loginUser() {
    const { phoneNumber, password } = this.state;
    var phonEmail = phoneNumber + "@karigar.com";
    // const { navigate } = this.props.navigation;
    this.setState({ error: '', loading: true });
    console.log('hoho');
    // NOTE Post to HTTPS only in production
    axios.post("http://karigar.greelogix.com/api/login", {
      email: phonEmail,
      password: password
    })
      .then((response) => {
        //              console.log(response.data);

        //            console.log(response.data.access_token);
        if (response.data.status == "success") {
          // alert(response.data.message);
          this.setState({
            loading: false
          });
          deviceStorage.saveItem("id_token", response.data.access_token);
          this.props.navigation.navigate('AppHome');
          // this.props.newJWT(response.data.access_token);
        } else {
          this.setState({
            loading: false
          });
          alert(response.data.message);
        }

      })
      .catch((error) => {
        this.setState({
          error: error.toString(),
          loading: false
        });
        // alert(error);
        console.log(error);
      });
  }
  onLoginFail() {
    this.setState({
      error: 'Login Failed',
      loading: false
    });
  }

  render() {


    const { phoneNumber, password, error, loading } = this.state;
    const { form, section, errorTextStyle, imageThumbnail } = styles;
    if (loading) {
      return (
        <View style={form}>

          <Loading size={'large'} />
        </View>
      );
    } else {
      return (

        <View style={form}>
          <View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>

              <Image style={imageThumbnail} source={require('../../assets/logo.jpg')} />
            </View>
            <View style={{ marginVertical: 5, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 36, color: "#0065b3", fontWeight: "bold" }}>
                Sign In
              </Text>

            </View>

            <View style={section}>
              <View style={[styles.containerStyle, { paddingHorizontal: 10 }]}>
                <Item style={{ borderBottomWidth: 0 }}>
                  <Icon active name='md-phone-portrait' />
                  <PhoneInput
                    style={{ borderBottomWidth: 0 }}
                    flagStyle={styles.labelStyle}
                    textStyle={styles.inputStyle}
                    textProps={{ placeholder: '300 1234567' }}
                    ref={ref => {
                      this.phone = ref;
                    }}
                    onChangePhoneNumber={(res) => {
                      // console.log(res);
                      if (this.phone.getValue()) {
                        this.setState({ phoneNumber: this.phone.getValue() })
                      }
                    }}
                    autoFormat={true}
                    initialCountry="pk" />
                </Item>
              </View>
            </View>
            <View style={section}>
              <View style={[styles.containerStyle, { paddingHorizontal: 10 }]}>
                <Item style={{ borderBottomWidth: 0 }}>
                  <Icon active name='md-lock' android="md-lock" />
                  <MyInput
                    secureTextEntry
                    placeholder="password"
                    label="Password"
                    value={password}
                    onChangeText={password => this.setState({ password })} />
                </Item>
              </View>
            </View>


            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#0065b3", }} onPress={() => {
                console.log("woow")
                this.props.navigation.navigate("PasswordReset")
              }}>
                Forgot Password?
              </Text>


            </View>
            <View style={{ flexDirection: "row" }}>
              {/* <View style={{
                flex: 1,
                marginRight: 5,
              }}>
                <Button color="#3A8F41" title="Register" onPress={() => {
                  console.log("woow")
                  this.props.navigation.navigate("SignUp")
                }} />

              </View> */}
              <View style={{
                flex: 1,
                marginLeft: 5,

              }}>

                <StyledButton style={{ height: 60, backgroundColor: "#0065b3", justifyContent: "center", alignItems: "center", borderRadius: 6, borderColor: "#ffca08" }} transparent onPress={this.loginUser} >
                  <Text style={{ color: "#fff", fontSize: 24 }}>
                    Login
                  </Text>
                </StyledButton>
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: "#0065b3", }} onPress={() => {
                console.log("woow")
                this.props.navigation.navigate("SignUp")
              }}>
                Dont have an account? Register here!
              </Text>


            </View>
            <Text style={errorTextStyle}>
              {error}
            </Text>
          </View >
        </View >


      );
    }
  }
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    // backgroundColor: "#f5f5f5",
    // backgroundColor: "red"
  },
  section: {
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginTop: 15,
    borderRadius: 6,
  },
  errorTextStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red'
  },
  imageThumbnail: {

    borderRadius: 100,
    width: 150,
    height: 150,

  },
  containerStyle: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "center"
  },
  labelStyle: {


    fontSize: 8,
    // paddingLeft: 20,
    // marginLeft: 20,
    // paddingRight: 20,
    // marginRight: 40,
    // flex: 0.10,
  },
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    lineHeight: 24,
    // flex: 3,

  }
});

export { Login };
