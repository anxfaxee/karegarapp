import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import Auth from './screens/Auth';
import deviceStorage from './services/deviceStorage.js';
import Home from "./screens/Home.js";
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
// call and api can be moved to redux store
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            jwt: '',
            loading: true,
            isConnected: false
        }
        this.newJWT = this.newJWT.bind(this);
        this.deleteJWT = deviceStorage.deleteJWT.bind(this);
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadJWT().then((res) => {
            // console.log(this.state.jwt);

            console.log("user loading")

            // console.log(this.state.jwt)
            const headers = {
                Authorization: 'Bearer ' + this.state.jwt,
            };
            axios({
                method: 'GET',
                url: 'http://karigar.greelogix.com/api/me',
                headers: headers,
            }).then(response => {
                console.log(response);
                if (response.data.status == "error") {
                    this.deleteJWT();
                    this.setState({
                        error: response.data.message,
                        loading: false,
                    });
                    return;
                }
                // var servies = response.data.services.map((currentValue, index, ar) => {
                //     return { id: currentValue.id, title: currentValue.name };
                // });
                // console.log(servies)
                this.setState({

                    loading: false,
                });

            }).catch(error => {
                console.log(error);

            });
            // setTimeout(() => {
            //     this.setState({ loading: false });
            // }, 2000)
            // 
        });
    }
    componentDidMount() {
        NetInfo.addEventListener("connectionChange", this.handleConnectionChange);
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleConnectionChange
        );
    }
    handleConnectionChange = connectionInfo => {
        console.log("connection info: ", connectionInfo);
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isInternetReachable);
            this.setState({ isConnected: state.isInternetReachable });
        });
        // NetInfo.isConnected.fetch().then(isConnected => {
        //     this.setState({ isConnected: isConnected });
        // });
    };
    newJWT(jwt) {
        this.setState({
            jwt: jwt
        });
    }

    render() {
        const { form, imageThumbnail } = styles;
        const { isConnected } = this.state;
        if (this.state.loading) {
            return (
                <View style={form}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image style={imageThumbnail} source={require('../assets/logo.jpg')} />
                    </View>
                    <View style={{ marginVertical: 30, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, textAlign: "justify", color: "#000" }}>
                            We provide on-demand and contractual technical services and maintenance for your home and your offices.
                            We deal in Electrical, Networking, Fire Alaram system, CCTV, Plumbing and others technical infrastructual problems.
                            Karigar Services offers great deals for residential and commercial based projects thats help small and large business to achieve their company goals.
                        </Text>
                    </View>
                    <View style={{ marginVertical: 5, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 20, color: "#0065b3", fontWeight: "bold" }}>
                            Call Today!
                        </Text>
                        <Text style={{ fontSize: 24, color: "#000", fontWeight: "bold" }}>
                            0800-SFTM
                        </Text>
                        <Text style={{ fontSize: 18 }}>
                            (08000-7836)
                        </Text>
                    </View>
                </View>

            );
        }
        else if (!isConnected) {
            return (
                <View style={form}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image style={imageThumbnail} source={require('../assets/logo.jpg')} />
                    </View>
                    <View style={{ marginVertical: 30, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, color: "#000", textAlign: "left" }}>
                            No internet connection availble.
                        </Text>
                    </View>

                </View>
            );
        }
        else {
            if (this.state.jwt != "") {
                console.log('wohoho')
                return (
                    <Home newJWT={this.newJWT} />
                );
            } else {
                console.log('cohoho')
                return (
                    <Auth newJWT={this.newJWT} />
                );

            }
        }
    }
}
const styles = StyleSheet.create({
    form: {
        width: '100%',
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: '#ddd',
        paddingHorizontal: 30,
    },
    section: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        backgroundColor: '#ddd',
        borderColor: '#ddd',
        marginTop: 15,
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

    }
});
