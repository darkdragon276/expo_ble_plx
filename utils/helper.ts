import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system/legacy';

const normalizeAngle = (alpha: number): number => {
    alpha = ((alpha + 180) % 360 + 360) % 360;
    return alpha - 180;
};

// convert imge to base64
const loadImg = async (localSrc: any) => {
    const src = Asset.fromModule(localSrc)
    await src.downloadAsync();
    const base64 = await FileSystem.readAsStringAsync(src.localUri || "", {
        encoding: "base64"
    });

    return `data:image/png;base64,${base64}`;
}

// convert seconds to mm:ss
const numberToMmss = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const mm = minutes.toString().padStart(2, "0");
    const ss = secs.toString().padStart(2, "0");

    return `${mm}:${ss}`;
}

export { normalizeAngle, loadImg, numberToMmss }