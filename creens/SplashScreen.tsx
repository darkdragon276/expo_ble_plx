import { StyleSheet, Animated, Text, View, Image, ImageBackground, StatusBar, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'
import app from "../app.json";

const SplashScreen = () => {
	const opacity = useRef(new Animated.Value(0)).current;
	const scale = useRef(new Animated.Value(0.8)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.spring(scale, {
				toValue: 1,
				friction: 6,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
			<ImageBackground
				source={require("../assets/Splash.png")}
				style={styles.background}
				resizeMode="cover"
			>
				<Animated.View style={[styles.logoWrapper, { opacity, transform: [{ scale }] }]}>
					<Image
						source={require("../assets/DarkLogo2.png")}
						style={styles.logo}
						resizeMode="cover"
					/>
					<Text style={styles.title}>HEADX</Text>
					<Text style={styles.title}>Motion Analytics Platform</Text>
					<Text style={styles.subtitle}> v{app.expo.version} Professional</Text>
				</Animated.View>
			</ImageBackground >
		</View>
	)
}

export default SplashScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//backgroundColor: '#0f172a',
		alignItems: 'center',
		justifyContent: 'center',
	},
	background: {
		flex: 1,
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoWrapper: {
		alignItems: 'center',
	},
	logo: {
		width: 120,
		height: 120,
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		color: '#f8fafc',
		fontWeight: '700',
	},
	subtitle: {
		marginTop: 8,
		color: '#94a3b8',
	},
});