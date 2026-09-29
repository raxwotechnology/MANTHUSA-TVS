import { VehicleInspectionsService } from './vehicle-inspections.service';
export declare class VehicleInspectionsController {
    private readonly inspections;
    constructor(inspections: VehicleInspectionsService);
    create(body: any): Promise<any>;
    findAll(): Promise<any[]>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}
