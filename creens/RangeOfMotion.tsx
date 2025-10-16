import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    Pressable,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { LucidePlay, LucideSquare, LucideUsers } from 'lucide-react-native'
import { Ionicons } from "@expo/vector-icons";
import { styled } from 'nativewind';
import { RootStackParamList } from "../model/RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import AssessmentCardExtension from "../components/RangeOfMotion/AssessmentExtension";
import AssessmentFlexion from "../components/RangeOfMotion/AssessmentFlexion";
import AssessmentLRotation from "../components/RangeOfMotion/AssessmentLRotation";
import AssessmentRRotation from "../components/RangeOfMotion/AssessmentRRotation";
import AssessmentLLateral from "../components/RangeOfMotion/AssessmentLLateral";
import AssessmentRLateral from "../components/RangeOfMotion/AssessmentRLateral";
import AssessmentDuration from "../components/RangeOfMotion/AssessmentDuration";

import { useDatabase } from "../db/useDatabase";
import { DB_INSERT_ROM } from "../db/dbQuery";
import { getCurrentDateTime } from "../utils/getDateTime";
import { ChildROMRef } from "../model/ChildRefGetValue";
import { KrossDevice } from "../ble/KrossDevice";
import { Characteristic } from "react-native-ble-plx";
import { bleEventEmitter } from "../utils/BleEmitter";
import { BLEService } from "../ble/BLEService";

const LuPlay = styled(LucidePlay);
const LuUsers = styled(LucideUsers);
const LuSquare = styled(LucideSquare);

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RProp = RouteProp<RootStackParamList, "RangeOfMotion">;

const ExtensionSrcImage = require("../assets/Extension.png");
const FlexionSrcImage = require("../assets/Flexion.png");
const LeftRotationSrcImage = require("../assets/LeftRotation.png");
const RightRotationSrcImage = require("../assets/RightRotation.png");
const LeftLateralSrcImage = require("../assets/LeftLateral2.png");
const RightLateralSrcImage = require("../assets/RightLateral2.png");
let NowObj = { localShortDateTime: "", strNow: "" };

const RangeOfMotion = () => {
    const navigation = useNavigation<NavigationProp>();
    const [record, setRecord] = useState(false);
    const db = useDatabase("headx.db");
    const route = useRoute<RProp>();

    const krossDevice = new KrossDevice();

    const refExtension = useRef<ChildROMRef>(null);
    const refFlexion = useRef<ChildROMRef>(null);
    const refLRotation = useRef<ChildROMRef>(null);
    const refRRotation = useRef<ChildROMRef>(null);
    const refLLateral = useRef<ChildROMRef>(null);
    const refRLateral = useRef<ChildROMRef>(null);
    const refDuration = useRef<ChildROMRef>(null);

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
                        onPress={() => navigation.replace("AssessmentSelection")}
                        className="flex-row items-center bg-gray-100 px-3 py-1 rounded-lg"
                    >
                        <Ionicons name="arrow-back" size={18} color="black" />
                        <Text className="ml-1 text-sm font-medium">Back</Text>
                    </Pressable>
                </View>
            ),
            headerRight: () => {
                return record
                    ?
                    <View className="flex-row items-center px-3 py-1 rounded-full bg-red-100 border border-red-300 mr-2">
                        <View className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2" />
                        <Text className="text-red-600 font-medium"> Recording</Text>
                    </View>
                    :
                    <></>;
            }
        });
    }, [navigation, record]);

    useEffect(() => {
        if (BLEService.deviceId === null) {
            Alert.alert('No device connected', `Please connect device from Dashboard`, [
                {
                    text: 'OK',
                    onPress: () => navigation.replace("Main"),
                }
            ]);
            return;
        };

        return () => {
            try {
                if (BLEService.getDevice() != null) {
                    BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
                }
            } catch (cleanupError) {
                //console.error("Error to cleanup BleManager:", cleanupError);
            }
            BLEService.stopSequence();
        };
    }, [])

    const addROMData = async (key: string, duration: number, nowObj: { localShortDateTime: string, strNow: string }) => {
        if (!db) {
            return;
        }
        const extension = refExtension.current?.getValue() || 0.0;
        const flexion = refFlexion.current?.getValue() || 0.0;
        const l_rotation = refLRotation.current?.getValue() || 0.0;
        const r_rotation = refRRotation.current?.getValue() || 0.0;
        const l_lateral = refLLateral.current?.getValue() || 0.0;
        const r_lateral = refRLateral.current?.getValue() || 0.0;

        let { title } = route.params;
        const dt: string = nowObj.strNow;
        const type: string = "ROM";

        if (title == "") {
            title = `ROM Session - ${nowObj.localShortDateTime}`;
        }

        await db.runAsync(DB_INSERT_ROM, [key, title, dt, type, extension, flexion, l_rotation, r_rotation, l_lateral, r_lateral, duration]);
    };

    const onPressRecording = async () => {
        NowObj.strNow = getCurrentDateTime().strNow;
        NowObj.localShortDateTime = getCurrentDateTime().localShortDateTime;

        await BLEService.startSequence();

        const onError = (error: Error): void => {
            console.log("Monitor onError: ", error);
        };

        let count = 0;
        const onMonitor = (char: Characteristic) => {
            let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
            if (data) {
                krossDevice.unpack(data);
                bleEventEmitter.emit('BleDataRoll', krossDevice.angle.roll);
                bleEventEmitter.emit('BleDataPitch', krossDevice.angle.pitch);
                bleEventEmitter.emit('BleDataYaw', krossDevice.angle.yaw);
                count++;
            }
            console.log("Monitor: ", char?.value);
        }

        let device = await BLEService.discoverAllServicesAndCharacteristicsForDevice()
            .catch((error) => {
                console.log("Error discover services: ", error);
                return;
            });
        if (!device) {
            Alert.alert('No device connected', `Please connect device from Dashboard`, [
                {
                    text: 'OK',
                    onPress: () => navigation.replace("Main"),
                }
            ]);
            return;
        }
        BLEService.setupMonitor(BLEService.SERVICE_UUID, BLEService.DATA_OUT_UUID, onMonitor, onError, BLEService.READ_DATA_TRANSACTION_ID);
        setRecord(true);
    };

    const onPressStopRecording = async () => {
        //button "Stop Recording" was unmounted so get "duration" right here
        const duration = refDuration.current?.getValue() || 0;

        await BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
        setRecord(false);

        setTimeout(async () => {
            const key: string = Date.now().toString();
            addROMData(key, duration, NowObj).then(() => {
                navigation.replace("RangeOfMotionSummary", { key: key })
            }).catch((error) => {
                console.log(error)
            });
        }, 50)
    };

    return (
        <ScrollView className="flex-1 p-4 space-y-6">
            <View className="items-center">
                <Text className="text-lg font-semibold mb-1">
                    Range of Motion Assessment
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                    Live data capture from all cervical movements
                </Text>
            </View>

            <View className="flex-1 space-y-6">
                {/* Card Instructions */}
                <View className="bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                    {/* Header */}
                    {/* <View className="flex-row items-center justify-center">
                        <LuUsers size={20}></LuUsers>
                        <Text className="ml-2 font-semibold text-blue-700">Instructions</Text>
                    </View> */}

                    {/* List Steps */}
                    <View className="space-y-2">
                        <View className="flex-row items-start">
                            <Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
                                1
                            </Text>
                            <Text className="flex-1 text-sm text-blue-700">
                                Position patient seated, looking straight ahead
                            </Text>
                        </View>

                        <View className="flex-row items-start">
                            <Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
                                2
                            </Text>
                            <Text className="flex-1 text-sm text-blue-700">
                                Start recording and guide through all 6 movements
                            </Text>
                        </View>

                        <View className="flex-row items-start">
                            <Text className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold text-center mr-2">
                                3
                            </Text>
                            <Text className="flex-1 text-sm text-blue-700">
                                Stop recording when complete to view results
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Start Assessment Button */}
            <View className="flex-row items-center justify-center rounded-xl bg-white p-4">
                {
                    !record
                        ?
                        <TouchableOpacity
                            onPress={onPressRecording}
                            activeOpacity={0.9} className="rounded-xl overflow-hidden shadow">
                            <LinearGradient
                                colors={["#0a66ff", "#00a3ff"]}
                                start={[0, 0]}
                                end={[1, 0]}
                                className="flex-row items-center justify-center w-full py-4 px-12"
                            >
                                <LuPlay size={20} color="white"></LuPlay>
                                <Text className="text-white font-semibold ml-2 p-3">Start Assessment</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={onPressStopRecording}
                            activeOpacity={0.9} className="rounded-xl overflow-hidden shadow">
                            <LinearGradient
                                colors={["#B91C1C", "#B91C1C"]}
                                start={[0, 0]}
                                end={[1, 0]}
                                className="flex-row bg-red-700 items-center justify-center w-full py-4 px-12"
                            >
                                <LuSquare size={20} color="white"></LuSquare>
                                <Text className="text-white font-semibold ml-2 p-3">Stop Recording</Text>
                                <AssessmentDuration record={record} ref={refDuration}></AssessmentDuration>
                            </LinearGradient>
                        </TouchableOpacity>
                }
            </View>

            <View className="flex-row flex-wrap">
                <View className="w-1/2 p-2">
                    <View className="bg-blue-50/80 border border-blue-300 rounded-xl p-3">
                        {/* Title */}
                        <Text className="font-semibold text-gray-800 mb-1">Extension</Text>
                        {/* Icon + description */}
                        <View className="items-center">
                            <Image
                                className="w-14 h-14"
                                source={ExtensionSrcImage}
                            />
                        </View>
                        <AssessmentCardExtension record={record} ref={refExtension}></AssessmentCardExtension>
                    </View>
                </View>

                <View className="w-1/2 p-2">
                    <View className="bg-green-50/80 border border-green-300 rounded-xl p-3">
                        {/* Title */}
                        <Text className="font-semibold text-gray-800 mb-1">Flexion</Text>

                        {/* Icon + description */}
                        <View className="items-center">
                            <Image
                                className="w-14 h-14"
                                source={FlexionSrcImage}
                            />
                        </View>
                        <AssessmentFlexion record={record} ref={refFlexion}></AssessmentFlexion>
                    </View>
                </View>

                <View className="w-1/2 p-2">
                    <View className="bg-purple-50/80 border border-purple-300 rounded-xl p-3">
                        {/* Title */}
                        <Text className="font-semibold text-gray-800 mb-1">Left Rotation</Text>

                        {/* Icon + description */}
                        <View className="items-center">
                            <Image
                                className="w-14 h-14"
                                style={{ transform: [{ rotate: '180deg' }] }}
                                source={LeftRotationSrcImage}
                            />
                        </View>
                        <AssessmentLRotation record={record} ref={refLRotation}></AssessmentLRotation>
                    </View>
                </View>

                <View className="w-1/2 p-2">
                    <View className="bg-orange-50/80 border border-orange-300 rounded-xl p-3">
                        {/* Title */}
                        <Text className="font-semibold text-gray-800 mb-1">Right Rotation</Text>

                        {/* Icon + description */}
                        <View className="items-center">
                            <Image
                                className="w-14 h-14"
                                style={{ transform: [{ rotate: '180deg' }] }}
                                source={RightRotationSrcImage}
                            />
                        </View>
                        <AssessmentRRotation record={record} ref={refRRotation}></AssessmentRRotation>
                    </View>
                </View>

                <View className="w-1/2 p-2">
                    <View className="bg-teal-50/80 border border-teal-300 rounded-xl p-3">
                        {/* Title */}
                        <Text className="font-semibold text-gray-800 mb-1">Left Lateral</Text>

                        {/* Icon + description */}
                        <View className="items-center">
                            <Image
                                className="w-14 h-14"
                                source={LeftLateralSrcImage}
                            />
                        </View>
                        <AssessmentLLateral record={record} ref={refLLateral}></AssessmentLLateral>
                    </View>
                </View>

                <View className="w-1/2 p-2">
                    <View className="bg-pink-50/80 border border-pink-300 rounded-xl p-3">
                        {/* Title */}
                        <Text className="font-semibold text-gray-800 mb-1">Right Lateral</Text>

                        {/* Icon + description */}
                        <View className="items-center">
                            <Image
                                className="w-14 h-14"
                                source={RightLateralSrcImage}
                            />
                        </View>
                        <AssessmentRLateral record={record} ref={refRLateral}></AssessmentRLateral>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default RangeOfMotion