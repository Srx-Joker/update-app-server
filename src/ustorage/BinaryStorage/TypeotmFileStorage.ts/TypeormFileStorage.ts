import { BaseFileStore } from "../BaseFileStorage";
import { EntityManager , QueryRunner } from 'typeorm'
import { createTable } from "./CreateTable.function";

export class TypeormFileStorage  implements BaseFileStore{
    private QueryRunner: QueryRunner;
    constructor(private entityManager:EntityManager) {
        this.QueryRunner = <QueryRunner>entityManager.queryRunner;
        createTable(this.QueryRunner);
    }

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