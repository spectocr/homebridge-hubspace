/**
 * HTTP response with device statuses for each attribute
 */
export interface DeviceStatusResponse {
    deviceId: string;
    attributes: {
        id: number;
        data: string;
        value: string;
        updatedTimestamp: number;
    }[];
    deviceState: {
        available: boolean;
    };
}
//# sourceMappingURL=device-status-response.d.ts.map