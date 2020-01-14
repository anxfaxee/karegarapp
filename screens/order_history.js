//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
// import all basic components
import AppHeader from '../components/AppHeader';
import deviceStorage from '../services/deviceStorage.js';
import { Loading } from '../components/common/';
import axios from 'axios';
const sttus = {
    "-1": "Cancelled",
    "0": 'Un-Assigned',
    "1": 'Assigned',
    "2": 'Pending payment',
    "3": 'Complete',
}
export default class order_history extends Component {
    //Screen1 Component

    constructor(props) {
        super(props);
        this.state = {
            jwt: '',
            error: "",
            loading: true,
            orders: {},
        }
        this.newJWT = this.newJWT.bind(this);
        this.deleteJWT = deviceStorage.deleteJWT.bind(this);
        this.loadJWT = deviceStorage.loadJWT.bind(this);
        this.loadOrders = this.loadOrders.bind(this);
        this.loadJWT().then(() => {
            // console.log(res)
            // this.setState({ loading: false });
            this.loadOrders();
        });
    }
    newJWT(jwt) {
        this.setState({
            jwt: jwt
        });
    }
    cancelOrder(orderId) {
        // return console.log(orderId);
        this.setState({

            loading: true,
        });
        const headers = {
            Authorization: 'Bearer ' + this.state.jwt,
        };

        // //console.log(serviceData);
        // NOTE Post to HTTPS only in 

        axios.post("http://karigar.greelogix.com/api/orders/" + orderId + "/cancel", {}, {
            headers: headers
        }).then(response => {
            console.log('aa')
            console.log(response.data);
            this.setState({

                loading: false,
            });
            if (response.data.status == "success") {
                // alert(response.data.message);
                this.setState({
                    orders: response.data.orders,
                    loading: false,
                });

                // alert("Order Placed Successfully");


            } else {
                this.setState({
                    loading: false,
                    error: response.data.message,
                });

                // alert(response.data.message);
            }

        })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: error,
                });
                // alert(error);

            });
    }
    loadOrders = () => {
        console.log("Orders loading")

        // console.log(this.state.jwt)
        const headers = {
            Authorization: 'Bearer ' + this.state.jwt,
        };
        axios({
            method: 'GET',
            url: 'http://karigar.greelogix.com/api/orders',
            headers: headers,
        }).then(response => {
            // console.log(response);
            this.setState({
                orders: response.data.orders,
                loading: false,
            });
        }).catch(error => {
            console.log(error);
            this.setState({
                error: 'Error retrieving data',
                loading: false,
            });
        });
    }

    render() {
        const { loading, orders, error } = this.state;
        const { container, errorText, } = styles;

        console.log(typeof orders)
        if (loading) {
            return (
                <View style={container}>
                    <AppHeader title="Order History" navigation={this.props.navigation} />
                    <Loading size={'large'} />
                </View>
            );
        } else if (typeof orders != 'undefined' && orders.length) {
            return (
                <View style={{ flex: 1 }}>
                    <AppHeader title="Order History" navigation={this.props.navigation} />
                    <ScrollView style={styles.container}>
                        <View style={styles.containerInner}>


                            {orders.map((item, key) =>
                                <View style={styles.itemCont}>
                                    <View style={[styles.itemSecContRow], { width: "100%" }}>

                                        <View>
                                            <Text style={{ fontSize: 22, textAlign: "left" }}>{item.service.name}
                                                {(item.status > -1) &&
                                                    <Text onPress={() => {
                                                        this.cancelOrder(item.id);
                                                    }} style={{ marginLeft: 5, lineHeight: 22, fontSize: 12, color: "red" }}>    ( Cancel )</Text>
                                                }
                                            </Text>



                                        </View>

                                    </View>
                                    <View style={styles.itemSecContRow}>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text>Name: </Text>
                                        </View>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text> {item.customer_name} </Text>
                                        </View>

                                    </View>
                                    <View style={styles.itemSecContRow}>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text>Time: </Text>
                                        </View>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text> {item.service_time} </Text>
                                        </View>

                                    </View>
                                    <View style={styles.itemSecContRow}>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text>Date: </Text>
                                        </View>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text> {item.service_date} </Text>
                                        </View>

                                    </View>
                                    <View style={styles.itemSecContRow}>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text>Status: </Text>
                                        </View>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text> {sttus[item.status]} </Text>
                                        </View>

                                    </View>

                                    <View style={styles.itemSecContRow}>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text>Booking: </Text>
                                        </View>
                                        <View style={styles.itemSecContRowCell}>
                                            <Text> {item.service_date} {item.service_time} </Text>
                                        </View>

                                    </View>

                                </View>

                            )}
                        </View>
                    </ScrollView >
                </View >
            );
        } else {
            return (
                <View style={container}>
                    <AppHeader title="Order History" navigation={this.props.navigation} />

                    <View>
                        <Text style={errorText}> {error} </Text>
                    </View>

                </View>
            );
        }

    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        // paddingHorizontal: 15,
        // marginTop: 50,
    },
    containerInner: {
        paddingHorizontal: 15
    },
    itemCont: {
        height: 200,
        flexDirection: 'column',
        margin: 5,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "#ffca08",
        borderWidth: 1,
    },
    itemSecContRow: {
        flex: 1,
        flexDirection: 'row',

    },
    itemSecContRowCell: {
        flex: 1,
        flexDirection: 'row',
    },
    titleText: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 20
    },
    errorText: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
    },

}