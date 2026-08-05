import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    NavigationContainer,
} from '@react-navigation/native';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import EditServiceScreen from '../screens/EditServiceScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import {
    AUTH_TOKEN_KEY,
} from '../services/api';
import {
    RootStackParamList,
} from '../types';

const Stack =
    createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const [isCheckingToken, setIsCheckingToken] =
        useState(true);
    const [isLoggedIn, setIsLoggedIn] =
        useState(false);

    useEffect(() => {
        const checkStoredToken = async () => {
            try {
                const token = await AsyncStorage.getItem(
                    AUTH_TOKEN_KEY,
                );

                setIsLoggedIn(Boolean(token));
            } catch {
                setIsLoggedIn(false);
            } finally {
                setIsCheckingToken(false);
            }
        };

        checkStoredToken();
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem(
            AUTH_TOKEN_KEY,
        );

        setIsLoggedIn(false);
    };

    if (isCheckingToken) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#ef6c35"
                />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                {isLoggedIn ? (
                    <>
                        <Stack.Screen name="Home">
                            {props => (
                                <HomeScreen
                                    {...props}
                                    onLogout={handleLogout}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen
                            name="AddService"
                            component={AddServiceScreen}
                        />
                        <Stack.Screen
                            name="ServiceDetail"
                            component={ServiceDetailScreen}
                        />
                        <Stack.Screen
                            name="EditService"
                            component={EditServiceScreen}
                        />
                    </>
                ) : (
                    <Stack.Screen name="Login">
                        {() => (
                            <LoginScreen
                                onLoginSuccess={
                                    handleLoginSuccess
                                }
                            />
                        )}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
});

export default AppNavigator;
