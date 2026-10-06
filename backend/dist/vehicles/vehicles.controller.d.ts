import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: any): Promise<import("./schemas/vehicle.schema").VehicleDocument>;
    findAll(req: any): Promise<any[]>;
    getQrCode(id: string): Promise<{
        stockNumber: string;
        vin: string;
        qrText: string;
        qrDataUrl: string;
    }>;
    getBarcode(id: string): Promise<{
        stockNumber: string;
        vin: string;
        barcodeText: string;
        barcodeSvg: string;
    }>;
    findOne(id: string, req: any): Promise<any>;
    update(id: string, updateVehicleDto: any): Promise<import("./schemas/vehicle.schema").VehicleDocument>;
    remove(id: string): Promise<any>;
}
