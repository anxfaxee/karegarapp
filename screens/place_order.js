//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { ScrollView, Dimensions, StyleSheet, View, Button, Text, Image, TouchableOpacity, Picker, Linking } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { Container, Header, Content, Textarea, Item, Input, Icon, Button as StyledButton, Toast } from 'native-base';
import { ToastAndroid } from 'react-native';
import LocationView from "react-native-location-view";
import { getUniqueId, getManufacturer } from 'react-native-device-info';

import MapView from 'react-native-maps';
import Marker from 'react-native-maps';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage.js';
import { Loading } from '../components/common/';
const { height, width } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;
const MAP_API_KEY = "AIzaSyBraI5NIFR3EoymF-h7QJccyrz-Xyi7ypU";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

import DateTimePicker from "react-native-modal-datetime-picker";
// import all basic components
import AppHeader from '../components/AppHeader';
import Geocoder from 'react-native-geocoder';

export default class PlaceOrder extends Component {
    //Screen1 Component

    constructor(props) {
        super(props);
        this.state = {
            jwt: '',
            error: "",
            errors: {
                // name: "aaaaaaaaaaa",
                // phone: "aaaaaaaaaaa",
                // address: "aaaaaaaaaaa",
                // defaultDate: "aaaaaaaaaaa",
                // defaultTime: "aaaaaaaaaaa",
            },
            unique_id: "",
            loading: true,
            email: '',
            name: '',
            lat: 0.0,
            long: 0.0,
            address: "",
            phone: "",
            isDatePickerVisible: false,
            isTimePickerVisible: false,
            is24Hour: true,
            defaultTime: "Select Time",
            defaultDate: "Select Date",
            service_id: 0,
            mapTop: 0,
            note: "",
            userLat: "",
            userLong: "",
            services: [],
            servicesRaw: [],
            showToast: false,
            mapReady: false,
            phoneNum: "0308-1126999",
            service_desc: "",
        };
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.fetchUserData = this.fetchUserData.bind(this);
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.placeOrderNow = this.placeOrderNow.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.handler = this.handler.bind(this)

        this.fetchUserData();
        this.loadJWT().then(() => {
            // //console.log(res)


        });
    }
    handler(res) {
        // //console.log('in handler');
        // //console.log(res);
        this.setState({
            lat: res.latitude,
            long: res.longitude,
            loading: true,
        });
        var NY = {
            lat: res.latitude,
            lng: res.longitude,
        }
        Geocoder.geocodePosition(NY).then(res => {
            // res is an Array of geocoding object (see below)
            // //console.log(res)
            let address = res[0];
            // if (address) {
            this.setState({ address: address.formattedAddress, loading: false })
            // }
            // //console.log(address.formattedAddress)
        }).catch(err => {
            //console.log(err)
            this.setState({ loading: false })
        });
    }
    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };
    getAddress = () => {
        return this.selectOnMap();
        this.setState({ loading: true });
        Geolocation.getCurrentPosition(
            (position) => {
                //console.log(position.coords);
                this.setState({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    userLat: position.coords.latitude,
                    userLong: position.coords.longitude,
                })
                var NY = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
                Geocoder.geocodePosition(NY).then(res => {
                    // res is an Array of geocoding object (see below)
                    // //console.log(res)
                    let address = res[0];
                    // if (address) {
                    this.setState({ address: address.formattedAddress, loading: false })
                    // }
                    // //console.log(address.formattedAddress)
                }).catch(err => {
                    //console.log(err)
                    this.setState({ loading: false })
                });
            },
            (error) => {
                // See error code charts below.
                //console.log(error.code, error.message);
                // requestLocationPermission();
                this.setState({ mapReady: true, loading: false });
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

        // var userLat = this.state.userLat;
        // var userLong = this.state.userLong;
        // var NY = {
        //     lat: userLat,
        //     lng: userLong
        // };
        // this.setState({
        //     lat: userLat,
        //     long: userLong,


        // })

    }
    makeCall = () => {
        console.log("phone");
        let phoneNumber = this.state.phoneNum;
        Linking.openURL(`tel:${phoneNumber}`);

    }
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };
    handleDatePicked = date => {
        let options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric"
        };
        this.setState({ defaultDate: date.toLocaleDateString("en-us") });
        this.hideDatePicker();
    };
    handleTimePicked = date => {
        // let options = {

        //     hour: "2-digit", minute: "2-digit"
        // };
        this.setState({ defaultTime: date.toLocaleTimeString("en-us") });
        this.hideTimePicker();
    };
    showTimePicker = () => {
        // //console.log('aa')
        this.setState({ isTimePickerVisible: true });
    };

    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };


    toggleDrawer = () => {
        //Props to open/close the drawer
        this.props.navigation.navigate("PlaceOrder", {
            service_id: id
        })
    };
    selectOnMap = () => {
        this.props.navigation.navigate("MyNativeMap", { handler: this.handler });
    }
    placeOrderNow() {
        var unique_id = getUniqueId();
        const { email, name, address, lat, long, phone, defaultDate, defaultTime, service_id, note } = this.state;
        // const { navigate } = this.props.navigation;
        // this.setState({ error: '', loading: true });
        // //console.log(service_id);
        // return;
        var errorsChecked = {};
        // if (email == "") {
        //     errorsChecked["email"] = "Email is required";

        //     // return alert("Name field is required");
        // }
        if (name == "") {
            errorsChecked["name"] = "Name is required";

            // return alert("Name field is required");
        }
        if (phone == "") {
            errorsChecked["phone"] = "Phone field is required"
        }




        if (defaultDate == "Select Date" || defaultDate == "") {
            errorsChecked["defaultDate"] = "Date field is required";
            // return alert("Date field is required");
        }
        if (defaultTime == "Select Time" || defaultTime == "") {
            errorsChecked["defaultTime"] = "Time field is required";
            // return alert("Time field is required");
        }
        if (address == "") {
            errorsChecked["address"] = "Address field is required";
            // return alert("Address field is required");
        }
        var errorsCheckedsize = Object.keys(errorsChecked).length;
        // //console.log(errorsCheckedsize)
        if (errorsCheckedsize > 0) {
            return this.setState({ errors: errorsChecked });
        }

        this.setState({

            loading: true,
        });
        const headers = {
            Authorization: 'Bearer ' + this.state.jwt,
        };
        var serviceData = {
            email: email,
            name: name,
            address: address,
            lat: lat,
            long: long,
            phone: phone,
            service_date: defaultDate,
            service_time: defaultTime,
            service_id: service_id,
            note: note,

        };
        // //console.log(serviceData);
        // NOTE Post to HTTPS only in 

        axios.post("http://karigar.greelogix.com/api/orders/" + unique_id, serviceData, {
            headers: headers
        }).then(response => {

            console.log(response);
            if (response.data.status == "success") {
                // alert(response.data.message);
                this.setState({

                    loading: false,
                });
                ToastAndroid.show('Order Placed Successfully!', ToastAndroid.SHORT);

                // alert("Order Placed Successfully");

                this.props.navigation.navigate('Home');

            } else {
                this.setState({
                    loading: false,
                });
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

                // alert(response.data.message);
            }

        })
            .catch((error) => {
                this.setState({
                    loading: false,
                });
                // alert(error);
                ToastAndroid.show(error, ToastAndroid.SHORT);
                //console.log(error);
            });
    }
    fetchUserData = () => {
        // console.log("deviceid " + )
        var unique_id = getUniqueId();
        // //console.log(this.state.jwt)
        const headers = {
            Authorization: 'Bearer ' + this.state.jwt,
        };
        axios({
            method: 'GET',
            url: 'http://karigar.greelogix.com/api/me/' + unique_id,
            headers: headers,
        }).then(response => {
            console.log(response);
            if (response.data.status == "error") {
                this.setState({
                    error: response.data.message,
                    loading: false,
                });
                return;
            }
            // var servies = response.data.services.map((currentValue, index, ar) => {
            //     return { id: currentValue.id, title: currentValue.name };
            // });
            // console.log(response.data.serviesRaw);
            let servicesRaw = response.data.serviesRaw;
            let service = servicesRaw[this.state.service_id];
            this.setState({
                email: response.data.email,
                name: response.data.name,
                phone: response.data.phone_number,
                services: response.data.services,
                servicesRaw: response.data.serviesRaw,
                service_desc: service.description,
                unique_id: unique_id,
                loading: false,
            });

        }).catch(error => {
            //console.log(error);
            this.setState({
                error: 'Error retrieving data',
                loading: false,
            });
        });
    }
    componentDidMount() {
        this.requestLocationPermission();
        var service_id = this.props.navigation.getParam('service_id');
        this.setState(
            {
                service_id: service_id
            })
        // this.watchID = Geolocation.watchPosition((position) => {
        //     console.log("got postion")

        //     this.setState({
        //         lat: position.coords.latitude,
        //         long: position.coords.longitude,
        //         userLat: position.coords.latitude,
        //         userLong: position.coords.longitude,
        //         // mapReady: true,

        //     });
        //     // Create the object to update this.state.mapRegion through the onRegionChange function
        //     let region = {
        //         lat: position.coords.latitude,
        //         lng: position.coords.longitude,

        //     }
        //     Geocoder.geocodePosition(region).then(res => {
        //         // res is an Array of geocoding object (see below)
        //         // //console.log(res)
        //         let address = res[0];
        //         // if (address) {
        //         this.setState({ address: address.formattedAddress, mapReady: true })
        //         // }
        //         // //console.log(address.formattedAddress)
        //     }).catch(err => {
        //         console.log(err)
        //         this.setState({ mapReady: true })
        //     });

        // }, (error) => console.log(error));
        // return;
        // Instead of navigator.geolocation, just use Geolocation.




    }
    componentWillUnmount() {
        // Geolocation.clearWatch(this.watchID);
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
                    //console.log("You've access for the location");
                    Geolocation.getCurrentPosition(
                        (position) => {
                            console.log('postion got')
                            console.log(position.coords);
                            this.setState({
                                lat: position.coords.latitude,
                                long: position.coords.longitude,
                                userLat: position.coords.latitude,
                                userLong: position.coords.longitude,
                                // mapReady: true,

                            });
                            var NY = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            }
                            Geocoder.geocodePosition(NY).then(res => {
                                // res is an Array of geocoding object (see below)
                                // //console.log(res)
                                let address = res[0];
                                // if (address) {
                                this.setState({ address: address.formattedAddress, mapReady: true })
                                // }
                                // //console.log(address.formattedAddress)
                            }).catch(err => {
                                //console.log(err)
                                this.setState({ mapReady: true })
                            });
                        },
                        (error) => {
                            console.log('postion error')
                            // See error code charts below.
                            console.log(error.code, error.message);
                            // requestLocationPermission();
                            this.setState({ mapReady: true });
                        },
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 5000 }
                    );
                } else {
                    ToastAndroid.show("Please enable location access", ToastAndroid.SHORT);
                    //console.log("You don't have access for the location");
                }
            } catch (err) {
                //console.log(err)
            }
        }
    };
    render() {

        if (this.state.loading || !this.state.mapReady) {
            return (
                <View style={styles.primaryContainer}>
                    <Loading size={'large'} />
                </View>
            );
        } else {
            const { services, servicesRaw } = this.state;
            //console.log(services);
            console.log("aaaa")
            const { errorText } = styles;
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.bottomView} >

                        <StyledButton onPress={this.makeCall} style={{ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flex: 1 }} transparent>
                            <Icon name='md-call' />
                        </StyledButton>

                    </View>
                    <AppHeader title="Place Order" navigation={this.props.navigation} />
                    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
                        {/* <View style={{ justifyContent: "center", alignItems: "center", marginHorizontal: -15, height: 100, backgroundColor: "#0065b3" }}>
                        <Image style={styles.imageThumbnail} source={require('../../assets/logo.jpg')} />
                    </View> */}
                        <View style={styles.MainContainer}>


                            <Text>  {this.state.service_desc}</Text>
                            <View style={styles.secCont}>
                                <View style={styles.secContBorder}>
                                    <Picker
                                        mode={"dropdown"}
                                        selectedValue={this.state.service_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            // console.log(services)
                                            let service = servicesRaw[itemValue]
                                            // console.log(service)
                                            this.setState({ service_id: itemValue, service_desc: service.description })
                                        }

                                        }>
                                        {services.map((current) => {

                                            return <Picker.Item label={current.title} value={current.id} />
                                        })}
                                        {/* <Picker.Item label="Java" value="java" />
                                    <Picker.Item label="JavaScript" value="js" /> */}
                                    </Picker>

                                </View>

                            </View>
                            <View style={styles.secCont}>
                                <View style={styles.secContBorder}>
                                    <Item>
                                        <Icon active name='md-user' android="md-person" />
                                        <Input placeholder='Name' value={this.state.name} onChangeText={name => this.setState({ name })} />
                                    </Item>
                                </View>
                                {this.state.errors.name && <Text style={errorText}>{this.state.errors.name}</Text>}

                            </View>
                            {/* <View style={styles.secCont}>
                            <Item>
                                <Icon active name='md-mail' />
                                <Input placeholder='Email' value={this.state.email} onChangeText={email => this.setState({ email })} />
                            </Item>

                        </View> */}
                            <View style={[styles.secCont]}>
                                <View style={styles.secContBorder}>
                                    <Item >
                                        <Icon active name='md-phone-portrait' />
                                        <Input placeholder='Phone' value={this.state.phone} onChangeText={phone => this.setState({ phone })} />

                                    </Item>
                                </View>
                            </View>
                            {this.state.errors.phone && <Text style={errorText}>{this.state.errors.phone}</Text>}
                            <View style={[styles.secCont, {}]}>
                                <View style={{ height: 50, flexDirection: "row", }}>
                                    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 5, justifyContent: "center", marginRight: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 6 }}>

                                        <TouchableOpacity >
                                            <Item onPress={this.showDatePicker} style={{ borderBottomWidth: 0 }}>
                                                <Icon active name='md-calendar' />
                                                <Text>{this.state.defaultDate}</Text>
                                            </Item>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            mode="date"
                                            isVisible={this.state.isDatePickerVisible}
                                            onConfirm={this.handleDatePicked}
                                            onCancel={this.hideDatePicker}
                                            minimumDate={new Date()}
                                        />
                                    </View>
                                    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 5, justifyContent: "center", marginLeft: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 6 }}>
                                        <TouchableOpacity >
                                            <Item onPress={this.showTimePicker} style={{ borderBottomWidth: 0 }} >
                                                <Icon active name='md-clock' />
                                                <Text>{this.state.defaultTime}</Text>
                                            </Item>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            mode="time"
                                            is24Hour={this.state.isTimePickerVisible}
                                            isVisible={this.state.isTimePickerVisible}
                                            onConfirm={this.handleTimePicked}
                                            onCancel={this.hideTimePicker}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1 }}>
                                {(this.state.errors.defaultDate || this.state.errors.defaultTime) && <Text style={[errorText, { flex: 1 }]}>{this.state.errors.defaultDate}</Text>}
                                {(this.state.errors.defaultTime || this.state.errors.defaultDate) && <Text style={[errorText, { flex: 1, marginLeft: 15 }]}>{this.state.errors.defaultTime}</Text>}
                            </View>
                            <View style={styles.secCont}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flex: 5, marginRight: 10 }}>
                                        <View style={styles.secContBorder}>
                                            <Item >
                                                {/* <Icon active name='md-phone-portrait' /> */}
                                                <Textarea rowSpan={2} style={{ lineHeight: 14, fontSize: 12 }} placeholder="Address" value={this.state.address} onChangeText={address => this.setState({ address })} />
                                                {/* <Input placeholder='Address' value={this.state.address} onChangeText={address => this.setState({ address })} /> */}

                                            </Item>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 5 }}>

                                        <StyledButton disabled={!this.state.mapReady} onPress={this.getAddress} style={{ borderWidth: 2, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 6, borderColor: "#ffca08", flex: 1 }} >
                                            <Icon name='locate' />
                                        </StyledButton>
                                    </View>
                                </View>
                                {/* <Textarea rowSpan={3} bordered placeholder="Address" onChangeText={address => this.setState({ address })} /> */}

                            </View>
                            {this.state.errors.address && <Text style={errorText}>{this.state.errors.address}</Text>}

                            {/* <View style={styles.secCont}>
                            <TouchableOpacity >
                                <Item onPress={this.showTimePicker}>
                                    <Icon active name='md-clock' />
                                    <Text>{this.state.defaultTime}</Text>
                                </Item>
                            </TouchableOpacity>
                            <DateTimePicker
                                mode="time"
                                is24Hour={this.state.isTimePickerVisible}
                                isVisible={this.state.isTimePickerVisible}
                                onConfirm={this.handleTimePicked}
                                onCancel={this.hideTimePicker}
                            />
                        </View> */}
                            {/* 
                            <View style={[styles.secCont, { height: 150, borderWidth: 1, borderColor: "#ccc", marginBottom: 10, marginTop: 10, }]}>


                                <MapView
                                    onPress={(e) => {
                                        this.selectOnMap();
                                    }}
                                    showsMyLocationButton={true}
                                    showsUserLocation={false}
                                    style={[styles.map]}
                                    region={{
                                        latitude: this.state.lat,
                                        longitude: this.state.long,
                                        longitudeDelta: LONGITUDE_DELTA,
                                        latitudeDelta: LATITUDE_DELTA,
                                    }}
                                >

                                </MapView>
                            </View> */}
                            <View style={styles.secCont}>
                                <View style={styles.secContBorder}>
                                    <Textarea style={{ lineHeight: 14, fontSize: 12 }} rowSpan={2} placeholder="Note" onChangeText={note => this.setState({ note })} />
                                </View>
                            </View>

                            <View style={[styles.secCont]}>
                                <StyledButton onPress={this.placeOrderNow} style={{ borderWidth: 2, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 6, borderColor: "#ffca08" }} transparent>
                                    <Text>Submit</Text>
                                </StyledButton>
                                {/* <Button style={[{ borderWidth: 1, borderColor: "#ffca08" }]} color="#fff" title="Submit" onPress={this.placeOrderNow} /> */}
                            </View>


                        </View >
                    </ScrollView>
                </View >
            );
        }
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
    errorText: {

        fontSize: 14,
        color: 'red',
        width: "100%",
        // backgroundColor: "#000",

    },
    imageThumbnail: {

        width: 100,
        height: 100,

    },
    bottomView: {
        width: 50,
        height: 50,
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderRadius: 50,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#ffca08",
        zIndex: 9,
    }
});