import { PeripheralFilter } from "./peripheralFilter";
import { SmartLock, NUKI_SERVICE_UUID, NUKI_OPENER_SERVICE_UUID } from "./smartLock";

export class SmartLockPeripheralFilter implements PeripheralFilter {
    constructor(public macAddress?: string) {
    }

    handle(peripheral: import("@abandonware/noble").Peripheral): boolean {
        let data: Buffer = peripheral.advertisement.manufacturerData;

        if (this.macAddress) {
            return peripheral.address.replace(/-|:/g, '')===this.macAddress.replace(/-|:/g, '').toLowerCase();
        } else if (data!==undefined && data!==null && data.length==25) {
            let type: number = data.readUInt8(2);
            let dataLength: number = data.readUInt8(3);

            // 0x02 == iBeacon
            if (type==2 && dataLength==21) {
                let serviceUuid: string = data.slice(4, 20).toString('hex');
                return serviceUuid==NUKI_SERVICE_UUID || serviceUuid==NUKI_OPENER_SERVICE_UUID;
            }
            return false;
        } else {
            let name: string = peripheral.advertisement.localName;
            return name!==undefined && peripheral.advertisement.localName.slice(0, 5)==="Nuki_";
        }
    }

    getType(peripheral: import("@abandonware/noble").Peripheral): string {
        let data: Buffer = peripheral.advertisement.manufacturerData;

        if (data!==undefined && data!==null && data.length==25) {
            let type: number = data.readUInt8(2);
            let dataLength: number = data.readUInt8(3);

            // 0x02 == iBeacon
            if (type==2 && dataLength==21) {
                let serviceUuid: string = data.slice(4, 20).toString('hex');
                if (serviceUuid==NUKI_SERVICE_UUID) {
                    return "smartlock";
                } else if(serviceUuid==NUKI_OPENER_SERVICE_UUID) {
                    return "opener";
                }
            }
            return "";
        } else {
            let name: string = peripheral.advertisement.localName;
            if (name!==undefined && peripheral.advertisement.localName.slice(0, 11)==="Nuki_Opener") {
                return "opener";
            } else if (name!==undefined && peripheral.advertisement.localName.slice(0, 5)==="Nuki_") {
                return "smartlock";
            }
        }

        return "";
    }
}
