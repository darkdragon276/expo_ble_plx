import { styled } from "nativewind";
import { Text, View, Pressable, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { colorMap, colorMapBg, type ColorVariant } from '../../model/DotStatusColor';
import { useEffect, useState } from "react";
import { BLEService } from "../../ble/BLEService";

const Icon = styled(Ionicons);

type StatusDevice = {
    id: string;
    name: string | null;
    status: string | null;
    battery: number | null;
    color: string;
};

const MainDeviceStatus = ({ deviceId, setOpen }: { deviceId: string, setOpen: any }) => {
    const [dvInfo, setDvInfo] = useState<StatusDevice>();

    useEffect(() => {
        let cyclingIntervalId: NodeJS.Timeout | undefined;

        cyclingIntervalId = setInterval(() => {
            if (BLEService.deviceId === null) {
                setDvInfo(undefined);
                return;
            }
            let soc = BLEService.deviceSupportInfo?.batteryLevel || 0;
            const objDevice: StatusDevice = {
                id: deviceId,
                battery: soc === -1 ? null : soc,
                name: BLEService.deviceSupportInfo?.name || "",
                status: BLEService.deviceSupportInfo?.visible ? "Connected" : "",
                color: (soc >= 60) ? "green"
                    : (soc > 25 && soc < 60) ? "yellow"
                        : "red",
            };
            setDvInfo(objDevice);
        }, 1000);

        if (BLEService.deviceId !== deviceId && deviceId !== "") {
            BLEService.setDeviceById(deviceId);
        }

        return () => {
            if (cyclingIntervalId) {
                clearInterval(cyclingIntervalId);
            }
        }
    }, [deviceId]);

    return (
        <View className="bg-white rounded-2xl p-4 shadow">
            <View className="flex-row items-center space-x-2 mb-2">
                <Text className="text-gray-700 font-semibold">Device Status</Text>
                <View className="flex-1 justify-end items-center space-x-2">
                    {/* Battery icon */}
                    {
                        dvInfo && dvInfo?.battery
                            ?
                            <View className="flex-row items-center space-x-2">
                                {
                                    dvInfo.battery >= 60 ?
                                        <View className="flex-row items-center space-x-1">
                                            <Icon name="battery-half-outline" className="text-green-600" size={18} />
                                            <Text className="text-green-600">{dvInfo?.battery}%</Text>
                                        </View>
                                        : dvInfo.battery >= 25 ?
                                            <View className="flex-row items-center space-x-1">
                                                <Icon name="battery-half-outline" className="text-yellow-600" size={18} />
                                                <Text className="text-yellow-600">{dvInfo?.battery}%</Text>
                                            </View>
                                            :
                                            <View className="flex-row items-center space-x-1">
                                                <Icon name="battery-half-outline" className="text-red-600" size={18} />
                                                <Text className="text-red-600">{dvInfo?.battery}%</Text>
                                            </View>
                                }
                                {/* <Icon name="battery-half-outline" className={`text-${dvInfo.color}-600`} size={18} />
                                <Text className={`text-${dvInfo.color}-600`}>{dvInfo?.battery}%</Text> */}
                                <View className="w-2.5 h-2.5 rounded-xl bg-green-500 ml-2" />
                                <Text className="text-green-600 font-medium">{dvInfo?.status}</Text>
                            </View>
                            :
                            <></>
                    }
                </View>
            </View>

            {/* Combobox row */}
            <Pressable
                onPress={() => setOpen(true)}
                className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
            >
                <View className="flex-row items-center">
                    {/* green dot */}
                    {
                        dvInfo && dvInfo?.battery
                            ?
                            <>
                                <View className="w-3 h-3 rounded-xl bg-green-500 mr-3" />
                                <Text className="text-gray-700">{dvInfo?.name}</Text>
                            </>
                            :
                            <></>
                    }
                </View>

                <Text className="text-gray-400">
                    <Ionicons name="chevron-down" size={15} color="gray" />
                </Text>
            </Pressable>
        </View>
    )
}

export default MainDeviceStatus