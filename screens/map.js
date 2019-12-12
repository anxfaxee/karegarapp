//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { ScrollView, Dimensions, StyleSheet, View, Button, Text, Image, TouchableOpacity, Picker } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { Container, Header, Content, Textarea, Item, Input, Icon, Button as StyledButton, Toast } from 'native-base';
import MapView from "react-native-maps";
import Marker from 'react-native-maps';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage.js';
import { Loading } from '../components/common/';
const { height, width } = Dimensions.get("screen");
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const MAP_API_KEY = "AIzaSyBraI5NIFR3EoymF-h7QJccyrz-Xyi7ypU";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import LocationView from "react-native-location-view";

// import all basic components
import AppHeader from '../components/AppHeader';
import Geocoder from 'react-native-geocoder';

export default class Map extends Component {
    //Screen1 Component

    constructor(props) {
        super(props);
        this.state = {
            jwt: '',
            error: "",
            loading: true,

            lat: 0.0,
            long: 0.0,
            address: "",

            userLat: "",
            userLong: "",

            showToast: false,
            mapReady: false,
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);

        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.getAddress = this.getAddress.bind(this);



        this.loadJWT().then(() => {
            // console.log(res)


        });
    }

    getAddress = () => {
        var userLat = this.state.userLat;
        var userLong = this.state.userLong;
        var NY = {
            lat: userLat,
            lng: userLong
        };
        this.setState({
            lat: userLat,
            long: userLong,


        })
        Geocoder.geocodePosition(NY).then(res => {
            // res is an Array of geocoding object (see below)
            console.log(res)
            let address = res[0];
            // if (address) {
            this.setState({ address: address.formattedAddress })
            // }
            // console.log(address.formattedAddress)
        }).catch(err => console.log(err))
    }


    toggleDrawer = () => {
        //Props to open/close the drawer
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };


    componentDidMount() {
        this.requestLocationPermission();
        // Instead of navigator.geolocation, just use Geolocation.
        // this.watchID = Geolocation.watchPosition((position) => {
        //     console.log("got postion")

        //     this.setState({
        //         lat: position.coords.latitude,
        //         long: position.coords.longitude,
        //         userLat: position.coords.latitude,
        //         userLong: position.coords.longitude,
        //         loading: false,

        //     });
        //     // Create the object to update this.state.mapRegion through the onRegionChange function


        // }, (error) => console.log(error));
        // return;
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords);
                this.setState({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    userLat: position.coords.latitude,
                    userLong: position.coords.longitude,
                    loading: false,
                })
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                // requestLocationPermission();
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );


    }
    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
    }
    async requestLocationPermission() {
        const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
            alert("You've access for the location");
        } else {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Cool Location App required Location permission',
                        'message': 'We required Location permission in order to get device location ' +
                            'Please grant us.'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You've access for the location");
                } else {
                    console.log("You don't have access for the location");
                }
            } catch (err) {
                console.log(err)
            }
        }
    };

    render() {
        console.log(this.state.lat)
        console.log(this.state.long)
        if (this.state.loading) {
            return (
                <View style={styles.primaryContainer}>
                    <Loading size={'large'} />
                </View>
            );
        } else {
            return (

                <View style={{ flex: 1 }}>
                    <LocationView
                        apiKey={MAP_API_KEY}
                        onLocationSelect={(res) => {
                            console.log(res)
                            // const { navigation } = this.props;
                            // navigation.goBack();
                            // navigation.state.params.handler(res);
                        }}
                        actionButtonStyle={{ borderWidth: 2, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 6, borderColor: "#ffca08" }}
                        actionTextStyle={{ color: "#000", }}
                        actionText={"Done"}
                        debounceDuration={100}
                        markerColor={"#0065b3"}
                        initialLocation={{
                            latitude: this.state.lat,
                            longitude: this.state.long,
                        }}
                    />
                </View>

            );
        }
        return (
            <MapView
                onPress={(e) => {
                    let cords = e.nativeEvent.coordinate;
                    console.log(cords)
                    this.setState({
                        lat: cords.latitude,
                        long: cords.longitude,
                    })
                }}
                onMapReady={(e) => {
                    console.log("map ready")
                    this.setState({ mapReady: true })
                }}
                showsUserLocation={true}
                style={[styles.map]}
                minZoomLevel={17}

                loadingEnabled={true}
                initialRegion={{
                    latitude: this.state.lat,
                    longitude: this.state.long,
                    longitudeDelta: LONGITUDE_DELTA,
                    latitudeDelta: LATITUDE_DELTA,
                }}
            >
                <MapView.Marker
                    draggable
                    style={{ position: "absolute" }}
                    title={"Drag me to your location"}
                    coordinate={{
                        latitude: this.state.lat,
                        longitude: this.state.long,
                    }}
                    onDragEnd={(e) => {
                        let cords = e.nativeEvent.coordinate;
                        console.log(cords)

                        this.setState({
                            lat: cords.latitude,
                            long: cords.longitude,
                        })
                        var userLat = this.state.lat;
                        var userLong = this.state.long;
                        var NY = {
                            lat: userLat,
                            lng: userLong
                        };
                        console.log(NY)
                        Geocoder.geocodePosition(NY).then(res => {
                            // res is an Array of geocoding object (see below)
                            console.log(res)
                            let address = res[0];
                            // if (address) {
                            this.setState({ address: address.formattedAddress })
                            // }
                            // console.log(address.formattedAddress)
                        }).catch(err => console.log(err))
                    }}

                />
            </MapView>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: "#f5f5f5",
    },
    map: {
        position: 'relative',
        height: "100%",
        width: "100%"
    },
    MainContainer: {
        flexDirection: "column",
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#f5f5f5",
        marginTop: 0,
    },
    secCont: {
        // flex: 1,
        justifyContent: 'center',
        height: 60,
        // alignItems: "center",
        // marginVertical: 10,
        // borderWidth: 1,
        // borderColor: "#ccc",
        // flexDirection: "row",
    },
    secContBorder: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 5,
        backgroundColor: "#fff",
    },
    secContChil: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: '#ddd',
    },
    secContChilBottom: {
        alignItems: "center",
        justifyContent: "center",
        flex: 2,

    },
    textStyle: {
        fontSize: 18,
        fontWeight: "bold",

    },
    textStyleSec: {
        justifyContent: "center",
        fontSize: 12,
        textAlign: "center",
    },
    primaryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    inputCont: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d6d7da',


    },
    imageThumbnail: {

        width: 100,
        height: 100,

    }
});