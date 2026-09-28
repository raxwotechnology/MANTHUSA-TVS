import { VehicleHandoversService } from './vehicle-handovers.service';
export declare class VehicleHandoversController {
    private readonly handovers;
    constructor(handovers: VehicleHandoversService);
    create(body: any): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
}
