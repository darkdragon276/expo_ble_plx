import { BleManager } from "react-native-ble-plx";

class BLEManagerInstance {
  private static _instance: BleManager | null = null;

  private static _uuid: string = "";


  static setUUID(UUIDs: string): string {
    BLEManagerInstance._uuid = UUIDs
    return BLEManagerInstance._uuid;
  }

  static getUUID(): string {
    return BLEManagerInstance._uuid;
  }

  static getInstance(): BleManager {
    if (!BLEManagerInstance._instance) {
      BLEManagerInstance._instance = new BleManager();
      console.log("BLEManager initialized");
    }
    return BLEManagerInstance._instance;
  }

  static destroy(): void {
    if (BLEManagerInstance._instance) {
      BLEManagerInstance._instance.destroy();
      BLEManagerInstance._instance = null;
      console.log("BLEManager destroyed");
    }
  }
}

export default BLEManagerInstance;
