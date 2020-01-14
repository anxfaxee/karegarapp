//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
// import all basic components
import AppHeader from '../components/AppHeader';

export default class help extends Component {
    //Screen1 Component

    constructor(props) {
        super(props);
        this.toggleDrawer = this.toggleDrawer.bind(this);

    }

    toggleDrawer = () => {
        //Props to open/close the drawer
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };
    render() {
        const { form, imageThumbnail } = styles;
        return (
            <View style={{ flex: 1 }}>
                <AppHeader title="Contact" navigation={this.props.navigation} />

                <View style={form}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image style={imageThumbnail} source={require('../../assets/logo.jpg')} />
                    </View>

                    <View style={{ marginVertical: 5, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 24, color: "#0065b3", fontWeight: "bold" }}>
                            Imran Haider
                        </Text>

                        <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
                            0308-1126999
                        </Text>
                        <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
                            042-35116999
                        </Text>
                        <Text style={{ fontSize: 20, color: "#0065b3", fontWeight: "bold" }}>
                            Email:
                        </Text>
                        <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
                            karegar.pk@hotmail.com
                        </Text>
                        <Text style={{ fontSize: 20, color: "#0065b3", fontWeight: "bold" }}>
                            Facebook:
                        </Text>
                        <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
                            https://www.facebook.com/karegar.pk.52
                        </Text>
                        <Text style={{ fontSize: 20, color: "#0065b3", fontWeight: "bold" }}>
                            Address:
                        </Text>
                        <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>
                            House No 2, Block 2, B1 Township Lahore
                        </Text>

                    </View>
                </View>
            </View>
        );
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
