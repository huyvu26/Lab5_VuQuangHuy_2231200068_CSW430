import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons/static';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AUTH_TOKEN_KEY, login } from '../services/api';

type LoginScreenProps = {
    onLoginSuccess: () => void;
};

const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
    const insets = useSafeAreaInsets();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        const normalizedPhone = phone.trim();

        if (!normalizedPhone) {
            Alert.alert(
                'Notification',
                'Please enter your phone number.',
            );
            return;
        }

        if (!password) {
            Alert.alert(
                'Notification',
                'Please enter your password.',
            );
            return;
        }

        try {
            setIsLoading(true);

            const token = await login(
                normalizedPhone,
                password,
            );

            await AsyncStorage.setItem(
                AUTH_TOKEN_KEY,
                token,
            );

            onLoginSuccess();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unable to login. Please try again.';

            Alert.alert('Login failed', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <View
                style={[
                    styles.statusBarBackground,
                    { height: insets.top },
                ]}
            />

            <SafeAreaView
                style={styles.safeArea}
                edges={['left', 'right', 'bottom']}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={
                        Platform.OS === 'ios'
                            ? 'padding'
                            : undefined
                    }>
                    <View style={styles.content}>
                        <Text style={styles.title}>Login</Text>

                        <View style={styles.form}>
                            <TextInput
                                style={styles.phoneInput}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Phone"
                                placeholderTextColor="#929292"
                                keyboardType="phone-pad"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                            />

                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password"
                                    placeholderTextColor="#929292"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!isLoading}
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
                                />

                                <Pressable
                                    style={styles.eyeButton}
                                    hitSlop={10}
                                    onPress={() =>
                                        setShowPassword(value => !value)
                                    }>
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? 'eye-off-outline'
                                                : 'eye-outline'
                                        }
                                        size={20}
                                        color="#969696"
                                    />
                                </Pressable>
                            </View>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.loginButton,
                                    pressed &&
                                    !isLoading &&
                                    styles.loginButtonPressed,
                                ]}
                                disabled={isLoading}
                                onPress={handleLogin}>
                                {isLoading ? (
                                    <ActivityIndicator
                                        color="#FFFFFF"
                                        size="small"
                                    />
                                ) : (
                                    <Text style={styles.loginButtonText}>
                                        Login
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F45170',
    },
    statusBarBackground: {
        width: '100%',
        backgroundColor: '#F45170',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
    },
    title: {
        marginTop: 118,
        marginBottom: 38,
        color: '#F45170',
        fontSize: 42,
        fontWeight: '700',
        textAlign: 'center',
    },
    form: {
        width: '78%',
        maxWidth: 300,
    },
    phoneInput: {
        height: 48,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 7,
        backgroundColor: '#F7F7F7',
        color: '#222222',
        fontSize: 14,
        marginBottom: 12,
    },
    passwordContainer: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 7,
        backgroundColor: '#F7F7F7',
        marginBottom: 28,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingLeft: 13,
        paddingRight: 4,
        color: '#222222',
        fontSize: 14,
    },
    eyeButton: {
        width: 43,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        backgroundColor: '#F45170',
    },
    loginButtonPressed: {
        opacity: 0.82,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default LoginScreen;