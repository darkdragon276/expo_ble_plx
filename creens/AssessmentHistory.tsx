import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../model/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LucideDownload } from 'lucide-react-native';
import { styled } from 'nativewind';
import AssessmentHistoryFilter from "../components/AssessmentHistory/AssessmentHistoryFilter";
import AssessmentHistorySessionRecent from "../components/AssessmentHistory/AssessmentHistorySessionRecent";
import AssessmentHistoryTags from "../components/AssessmentHistory/AssessmentHistoryTags";
import AssessmentHistorROMChart from "../components/AssessmentHistory/AssessmentHistorROMChart";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LuDownload = styled(LucideDownload);

const AssessmentHistory = () => {
	const navigation = useNavigation<NavigationProp>();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "",
			headerTitleAlign: "left",
			headerStyle: {
				elevation: 0,
				shadowOpacity: 0,
				borderBottomWidth: 0,
			},
			headerLeft: () => (
				<View className="flex-row items-center">
					<Pressable
						onPress={() => navigation.goBack()}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			),
			headerRight: () => (
				<View className="flex-row items-center justify-center mb-1 mr-4">
					<Pressable
						onPress={() => { }}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<LuDownload size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Export</Text>
					</Pressable >
				</View>
			)
		});
	}, [navigation]);

	return (
		<ScrollView className="flex-1 bg-gray-50 p-4">
			<View className="w-full">
				<View className="items-center mb-6">
					<Text className="text-lg font-semibold mb-1">
						Assessment History
					</Text>
					<Text className="text-sm text-gray-500 text-center">
						Session tracking and progress analysis
					</Text>
				</View>
			</View>

			{/* Filter Section */}
			<AssessmentHistoryFilter></AssessmentHistoryFilter>

			{/* Stats Section */}
			<AssessmentHistoryTags></AssessmentHistoryTags>

			{/* Chart Section */}
			<AssessmentHistorROMChart></AssessmentHistorROMChart>

			{/* Session Recent Section */}
			<AssessmentHistorySessionRecent></AssessmentHistorySessionRecent>
		</ScrollView>
	)
}

export default AssessmentHistory

const styles = StyleSheet.create({})