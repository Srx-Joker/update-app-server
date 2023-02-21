import { BaseDataSourceOptions } from "typeorm/data-source/BaseDataSourceOptions";
import { BaseFileStore } from "./BaseFileStorage";

export class TypeormFileStorage  implements BaseFileStore{

    public get(version: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }

    public upload(version: string, file: Buffer): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public getDir(version: string): string {
        throw new Error("Method not implemented.");
    }
    public getLatestVersion(): string {
        throw new Error("Method not implemented.");
    }
    public getAllVersions(): string[] {
        throw new Error("Method not implemented.");
    }
    public has(version: string): boolean {
        throw new Error("Method not implemented.");
    }


}