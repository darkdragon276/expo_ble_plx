import { styled } from "nativewind";
import { Text, View, Pressable, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { colorMap, colorMapBg, type ColorVariant } from '../../model/DotStatusColor';
import { KrossDevice } from '../../ble/KrossDevice';
import { useEffect, useState } from "react";
import { BLEService } from "../../ble/BLEService";
import { Characteristic } from "react-native-ble-plx";

const Icon = styled(Ionicons);

type StatusDevice = {
    id: string;
    name: string | null;
    status: string | null;
    battery: number | null;
    color: string;
};

const MainDeviceStatus = ({ deviceId, setOpen }: { deviceId: string, setOpen: any }) => {
    const krossDevice = new KrossDevice();
    const [dvInfo, setDvInfo] = useState<StatusDevice>();
    const [localDeviceId, setLocalDeviceId] = useState<string>(deviceId);

    useEffect(() => {
        let IdDeviceSeleted = setDeviceSelected();
        if (IdDeviceSeleted) {
            deviceId = IdDeviceSeleted;
        }

        //setLocalDeviceId(deviceId)
        connectToDevice(deviceId)
    }, [deviceId]);

    const connectToDevice = async (deviceId: string) => {
        try {

            if (deviceId === "") {
                return;
            }

            BLEService.stopDeviceScan();

            const connected = await BLEService.connectToDevice(deviceId);
            if (!connected) {
                //Alert.alert('connect error', 'Device not connected');
                return;
            }

            const onError = (error: Error): void => {
                if (error) {
                    //Alert.alert('BLE Error', error?.message ?? String(error));
                    //console.error("BLE Error", error);
                    return;
                }
                return;
            };

            const onMonitor = (char: Characteristic) => {
                let data = krossDevice.onDataReceived(KrossDevice.decodeBase64(char?.value ?? ""));
                if (data) {
                    krossDevice.unpack(data);

                    setDvInfo((prev) => {
                        if (prev?.battery === krossDevice.soc) return prev;
                        return {
                            id: "",
                            battery: krossDevice.soc,
                            name: connected.name,
                            status: "Connected",
                            color: (krossDevice.soc >= 60) ? "green"
                                : (krossDevice.soc > 25 && krossDevice.soc < 60) ? "yellow"
                                    : "red",
                        };
                    });

                    BLEService.cancelTransaction(BLEService.READ_DATA_TRANSACTION_ID);
                    BLEService.disconnectDevice();
                } else {
                    // 	// console.log("Received data is null");
                }
            }

            await BLEService.discoverAllServicesAndCharacteristicsForDevice();
            BLEService.setupMonitor(BLEService.SERVICE_UUID, BLEService.DATA_OUT_UUID, onMonitor, onError, BLEService.READ_DATA_TRANSACTION_ID);

        } catch (e: any) {
            //Alert.alert('connect error', e?.message ?? String(e));
        }
    };

    const setDeviceSelected = () => {
        const deviceSeleted = BLEService.getDevice();
        if (!deviceSeleted)
            return undefined;

        const objDevice: StatusDevice = {
            id: deviceSeleted.id,
            battery: null,
            name: deviceSeleted.name,
            status: "",
            color: "",
        };

        setDvInfo(objDevice);

        return objDevice.id

    };

    // const color: ColorVariant = "green";
    // const colorbg: ColorVariant = "green";

    return (
        <View className="bg-white rounded-2xl p-4 shadow">
            <View className="flex-row items-center space-x-2 mb-2">
                <Text className="text-gray-700 font-semibold">Device Status</Text>
                <View className="w-20"></View>
                <View className="flex-row justify-end items-center space-x-2">
                    {/* Battery icon */}
                    {
                        dvInfo && dvInfo?.battery
                            ?
                            <View className="flex-row items-center space-x-2">
                                <Icon name="battery-half-outline" className={`text-${dvInfo.color}-600`} size={18} />
                                <Text className={`text-${dvInfo.color}-600`}>{dvInfo?.battery}%</Text>
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