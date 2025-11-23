import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system/legacy';
import { CIRCLE_LIMIT, SCALE_PERCENT } from "../dummy/Constants";
import { Alert } from "react-native";

const normalizeAngle = (alpha: number): number => {
    alpha = ((alpha + 180) % 360 + 360) % 360;
    return alpha - 180;
};

// convert imge to base64
const loadImg = async (localSrc: any): Promise<string> => {
    try {
        const src = Asset.fromModule(localSrc)
        await src.downloadAsync();

        // copy to document directory if not already there [necessary for Android production]
        if (!src.localUri?.startsWith('file://')) {
            const fileUri = FileSystem.documentDirectory + src.name;
            await FileSystem.copyAsync({
                from: src.localUri!,
                to: fileUri,
            });
            src.localUri = fileUri;
        }

        const base64 = await FileSystem.readAsStringAsync(src.localUri!, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return new Promise<string>((resolve) => { resolve(`data:image/png;base64,${base64}`) });
    }
    catch (error: any) {
        Alert.alert("Generating PDF - loadImg", error.message, [
            {
                text: 'OK',
            }
        ]);
        return new Promise<string>((reject) => { reject("") });
    }
}

// convert seconds to mm:ss
const numberToMmss = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const mm = minutes.toString().padStart(2, "0");
    const ss = secs.toString().padStart(2, "0");

    return `${mm}:${ss}`;
}

// scale JPS circle
const coordinatesScaleConvert = (coordinates: number, sign: number = 1): number => {
    let convert = 0;

    convert = coordinates * sign;
    coordinates = Math.abs(coordinates);

    if (coordinates < CIRCLE_LIMIT) {
        convert = convert * SCALE_PERCENT;
    }

    return Math.round(convert * 10) / 10;
}

export { normalizeAngle, loadImg, numberToMmss, coordinatesScaleConvert }