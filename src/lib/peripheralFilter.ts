export interface PeripheralFilter {
    handle(peripheral: import("@abandonware/noble").Peripheral): boolean;
    getType(peripheral: import("@abandonware/noble").Peripheral): string;
}
