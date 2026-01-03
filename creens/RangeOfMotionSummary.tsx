import { useEffect, useLayoutEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	View,
	Text,
	Pressable,
	Image,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Alert,
	Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { RotateCcw, PenLine, CircleAlert, ChartColumn, FileText, LucideCheck, LucideX } from 'lucide-react-native'
import { styled } from 'nativewind';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../model/RootStackParamList";
import { useDatabase } from "../db/useDatabase";
import { DB_SELECT_BY_ID_ROM, DB_UPDATE_BY_KEY_ROM } from "../db/dbQuery";
import useConvertDateTime from "../utils/convertDateTime";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system/legacy';
import { loadImg } from "../utils/helper";

const LuRotateCcw = styled(RotateCcw);
const LuPenLine = styled(PenLine);
const LuCircleAlert = styled(CircleAlert);
const LuChartColumn = styled(ChartColumn);
const LuFileText = styled(FileText);
const LuCheck = styled(LucideCheck);
const LuUnCheck = styled(LucideX);

const ExtensionSrcImage = require("../assets/Extension.png");
const FlexionSrcImage = require("../assets/Flexion.png");
const LeftRotationSrcImage = require("../assets/LeftRotation.png");
const RightRotationSrcImage = require("../assets/RightRotation.png");
const LeftLateralSrcImage = require("../assets/LeftLateral2.png");
const RightLateralSrcImage = require("../assets/RightLateral2.png");

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RProp = RouteProp<RootStackParamList, "RangeOfMotionSummary">;

type DataProp = {
	key: string,
	date: string,
	title: string,
	extension: number,
	flexion: number,
	l_rotation: number,
	r_rotation: number,
	l_lateral: number,
	r_lateral: number,
	duration: number,
}

type DtConvert = {
	date_MM_dd_yyyy_hh_mm_ss_ampm: string,
	date_MM_dd_yyyy_at_hh_mm_ampm: string,
	date_short: string,
}

const TitleSummary = ({ title, dataKey }: { title: string, dataKey: string }) => {
	const [text, setText] = useState(title)
	const [oldtext, setOldText] = useState(title)
	const [edit, setEditText] = useState(false)
	const db = useDatabase("headx.db");

	useEffect(() => {
		setText(title)
		setOldText(title);
	}, [title])

	const rollbackTitle = () => {
		setText(oldtext);
		setEditText(false);
	}

	const saveTitle = async () => {
		try {
			if (!db) {
				return;
			}

			await db.runAsync(DB_UPDATE_BY_KEY_ROM, [text, dataKey]);
			setText(text);
			setOldText(text);
		} catch (error) {
		} finally {
			setEditText(false)
		}
	}

	return (
		<View className="flex-row items-center justify-center">
			{
				!edit
					?
					<>
						<Text className="w-rounded-xl font-regular px-2 py-2 text-base">{text}</Text>
						<LuPenLine size={20} color="gray" onPress={() => setEditText(true)}></LuPenLine>
					</>
					:
					<>
						<TextInput
							className="w-rounded-xl font-regular px-2 py-2 text-base"
							defaultValue={text}
							onChangeText={newText => setText(newText)}
							placeholderTextColor="black"
						/>
						<View className="flex-row items-space-between">
							<TouchableOpacity onPress={saveTitle}>
								<View className="border border-green-500 rounded-md py-1 mr-2 z-10">
									<LuCheck size={20} className="text-green-500 px-6"></LuCheck>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={rollbackTitle}>
								<View className="border border-red-500 rounded-md py-1 mr-2 z-10">
									<LuUnCheck size={20} className="text-red-500 px-6"></LuUnCheck>
								</View>
							</TouchableOpacity>
						</View>
					</>
			}

		</View>
	)
};

let resultROMSummary: DataProp;

const RangeOfMotionSummary = () => {
	const navigation = useNavigation<NavigationProp>();
	const db = useDatabase("headx.db");
	const route = useRoute<RProp>();
	const [data, setData] = useState<DataProp | null>(null)
	const [dateConvert, setDateConvert] = useState<DtConvert | null>()

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
						onPress={onPressGotoMain}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<Ionicons name="arrow-back" size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Back</Text>
					</Pressable>
				</View>
			),
			headerRight: () => (
				<View className="flex-row items-center justify-center mb-1 mr-4">
					<TouchableOpacity
						activeOpacity={0.1}
						onPress={printPDF}
						className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
					>
						<LuFileText size={18} color="black" />
						<Text className="ml-1 text-sm font-medium">Export PDF</Text>
					</TouchableOpacity >
				</View>
			)
		});
	}, [navigation]);

	useEffect(() => {

		const selectData = async () => {
			try {
				if (!db) {
					return;
				}

				const { key } = route.params;
				const rs = await db.getFirstAsync<DataProp>(DB_SELECT_BY_ID_ROM, key);
				if (rs) {
					const { date_MM_dd_yyyy_hh_mm_ss_ampm, date_MM_dd_yyyy_at_hh_mm_ampm, date_short } = useConvertDateTime(new Date(rs.date));
					resultROMSummary = rs;
					resultROMSummary.date = date_MM_dd_yyyy_at_hh_mm_ampm
					setData(rs);
					setDateConvert({ date_MM_dd_yyyy_hh_mm_ss_ampm, date_MM_dd_yyyy_at_hh_mm_ampm, date_short })
				}
			} catch (error) {
				console.log(error);
			}
		};

		if (db) {
			selectData();
		}

	}, [db])

	const onPressGotoMain = () => {
		navigation.replace("Main")
	}

	const gotoAssessmentHistory = () => {
		navigation.replace("AssessmentHistory");
	};

	const printPDF = async () => {
		try {
			// data for .html
			const data = resultROMSummary

			// load images and convert to base64
			const images = [
				ExtensionSrcImage,
				FlexionSrcImage,
				LeftRotationSrcImage,
				RightRotationSrcImage,
				LeftLateralSrcImage,
				RightLateralSrcImage,
			];

			const [
				extensionSrcImage,
				flexionSrcImage,
				leftRotationSrcImage,
				rightRotationSrcImage,
				leftLateralSrcImage,
				rightLateralSrcImage
			] = await Promise.all(images.map(img => loadImg(img)));

			// load ROM html template
			const template = Asset.fromModule(require('../assets/PDFTemplate/ROMTemplate.html'));
			await template.downloadAsync();

			const htmlTemplate = await FileSystem.readAsStringAsync(template.localUri || "");

			if (template.localUri) {
				await FileSystem.deleteAsync(template.localUri, { idempotent: true });
			}

			// loaded data to html template
			const html = htmlTemplate
				.replace('{{title}}', data?.title || "")
				.replace('{{datetime}}', `ROM Assessment - ${data.date}`)
				//assessments
				.replace('{{extension}}', data?.extension?.toString() || "")
				.replace('{{flexion}}', data?.flexion?.toString() || "")
				.replace('{{leftRotation}}', data?.l_rotation?.toString() || "")
				.replace('{{rightRotation}}', data?.r_rotation?.toString() || "")
				.replace('{{leftLateral}}', data?.l_lateral?.toString() || "")
				.replace('{{rightLateral}}', data?.r_lateral?.toString() || "")
				//src base64 for <img>
				.replace('{{base64_extension}}', extensionSrcImage)
				.replace('{{base64_flexion}}', flexionSrcImage)
				.replace('{{base64_leftRotation}}', leftRotationSrcImage)
				.replace('{{base64_rightRotation}}', rightRotationSrcImage)
				.replace('{{base64_leftLateral}}', leftLateralSrcImage)
				.replace('{{base64_rightLateral}}', rightLateralSrcImage)

			// create PDF from .html -> covert to base64
			const { uri, base64 } = await Print.printToFileAsync({ html, base64: true });

			if (Platform.OS === 'ios') {
				// rename file
				const newPath = `${FileSystem.documentDirectory}${data?.title}.pdf`;

				await FileSystem.moveAsync({
					from: uri,
					to: newPath,
				});

				// open or share file PDF
				if (await Sharing.isAvailableAsync()) {
					await Sharing.shareAsync(newPath);
				}

				await FileSystem.deleteAsync(newPath, { idempotent: true });

			} else if (Platform.OS === 'android') {

				const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
				if (!perm.granted) {
					Alert.alert("Permission Denied", "You need to grant permission to access files.");
					return;
				}

				const dirUri = perm.directoryUri;
				const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
					dirUri,
					`${data?.title}.pdf`,
					"application/pdf"
				);

				await FileSystem.writeAsStringAsync(fileUri, base64 ?? "", {
					encoding: FileSystem.EncodingType.Base64,
				});
			}

			if (uri) {
				await FileSystem.deleteAsync(uri, { idempotent: true });
			}
		} catch (error) {
			Alert.alert("Generating PDF", (error as Error).message, [
				{
					text: 'OK',
				}
			]);
		}
	};

	return (
		<ScrollView className="flex-1 bg-gray-50 p-4">
			<View className="w-full">
				<View className="items-center mb-6">
					<TitleSummary
						title={data ? data?.title : ""}
						dataKey={data ? data?.key : ""}>
					</TitleSummary>
					<Text className="text-sm text-gray-500 text-center">
						ROM Assessment - {dateConvert?.date_MM_dd_yyyy_at_hh_mm_ampm}
					</Text>
				</View>

				{/* ROM Card */}
				{/* <View className="flex flex-col bg-white rounded-xl px-6 [&:last-child]:pb-6 mb-6">
					<View className="flex-row items-center py-4">

						<View className="items-center justify-center mr-2">
							<LuRotateCcw size={16} className="text-black-400"></LuRotateCcw>
						</View>
						<Text className="text-base">Range of Motion Summary</Text>
					</View>

					<View className="flex-row flex-wrap py-4">
						<View className="w-1/2">
							<Text className="text-xs text-muted-foreground mb-1 text-gray-400">Date & Time</Text>
							<Text className="font-medium text-xs">{dateConvert?.date_MM_dd_yyyy_hh_mm_ss_ampm}</Text>
						</View>

						<View className="w-1/2">
							<Text className="text-xs text-muted-foreground mb-1 text-gray-400">Duration</Text>
							<Text className="font-medium text-xs">
								{
									(data && data.duration >= 60)
										? (Math.trunc(data.duration / 60)) + " min " + (data.duration % 60) + "s"
										: data?.duration + "s"
								}
							</Text>
						</View>
					</View>
				</View> */}

				{/* ROM Card */}
				<View className="flex flex-col bg-white rounded-xl [&:last-child]:pb-6 mb-6">
					<View className="flex-row items-center p-4">
						{/* Icon circle */}
						<View className="items-center justify-center mr-2">
							{/* small rotation icon */}
							<LuRotateCcw size={22} className="text-blue-500"></LuRotateCcw>
						</View>
						<Text className="text-base">Range of Motion Visualisation</Text>
					</View>

					<View className="flex-row flex-wrap justify-between px-4">
						{[
							{ label: "Extension", value: data?.extension, image: ExtensionSrcImage, borderColor: "border-blue-300", bgColor: "bg-blue-50/80", textColor: "blue" },
							{ label: "Flexion", value: data?.flexion, image: FlexionSrcImage, borderColor: "border-green-300", bgColor: "bg-green-50/80", textColor: "green" },
							{ label: "Left Rotation", value: data?.l_rotation, image: LeftRotationSrcImage, borderColor: "border-purple-300", bgColor: "bg-purple-50/80", textColor: "purple", rotate: '180deg' },
							{ label: "Right Rotation", value: data?.r_rotation, image: RightRotationSrcImage, borderColor: "border-orange-300", bgColor: "bg-orange-50/80", textColor: "orange", rotate: '180deg' },
							{ label: "Left Lateral", value: data?.l_lateral, image: LeftLateralSrcImage, borderColor: "border-teal-300", bgColor: "bg-teal-50/80", textColor: "teal" },
							{ label: "Right Lateral", value: data?.r_lateral, image: RightLateralSrcImage, borderColor: "border-pink-300", bgColor: "bg-pink-50/80", textColor: "pink" },
						].map(({ label, value, image, borderColor, rotate, textColor, bgColor }) => (
							<View className="w-1/2 px-2 mb-4" key={label}>
								<View className="items-center space-y-2">
									<View className={`items-center ${bgColor} border ${borderColor} rounded-xl px-4 py-6 w-full`}>
										<Image
											className="w-14 h-14"
											style={rotate ? { transform: [{ rotate }] } : {}}
											source={image}
										/>
									</View>
									<View className="items-center">
										<Text className={`font-semibold text-${textColor}-600 text-sm`}>
											{label}
										</Text>
										<Text className={`text-lg font-bold text-${textColor}-600`}>
											{value ?? 0.0}°
										</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* Buttons area */}
				<View className="mt-1">
					<TouchableOpacity
						onPress={onPressGotoMain}
						activeOpacity={0.8}
						className="bg-green-600 rounded-xl py-4 items-center justify-center shadow-lg">
						<View className="flex-row items-center">
							<Text className="text-white text-sm font-semibold mr-3">✓</Text>
							<Text className="text-white text-sm font-semibold">Finish & Return Home</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.8}
						onPress={gotoAssessmentHistory}
						className="mt-3 border border-gray-300 rounded-xl py-2 items-center justify-center">
						<View className="flex-row items-center">
							<LuChartColumn size={20} color="black" className="mr-2"></LuChartColumn>
							<Text className="text-black-700 text-sm font-regular">View History</Text>
						</View>
					</TouchableOpacity>
				</View>

				<View className="h-4"></View>

				{/* Clinical Considerations Card */}
				<View className="bg-white rounded-xl p-4 shadow-md">
					<View className="flex-row items-center">
						<LuCircleAlert size={20} color="black" className="mr-3" />
						<Text className="text-base font-regular text-black flex-1">Clinical Considerations</Text>
					</View>

					{/* Notes Box */}
					<View className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
						<Text className="text-sm font-semibold text-blue-800 mb-3">Range of Motion Assessment Notes:</Text>
						<View className="gap-2  ml-2">
							<Text className="text-xs text-blue-800">• Values shown represent maximum achievable ranges in each direction</Text>
							<Text className="text-xs text-blue-800">• Consider pain levels and patient comfort during interpretation</Text>
							<Text className="text-xs text-blue-800">• Compare with age-matched normative data and previous assessments</Text>
						</View>
					</View>
				</View>

				<View className="h-12"></View>

			</View>
		</ScrollView >
	);
}

export default RangeOfMotionSummary