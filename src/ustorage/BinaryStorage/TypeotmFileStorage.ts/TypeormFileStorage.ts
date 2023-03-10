import { BaseFileStore } from "../BaseFileStorage";
import { DataSource, EntityManager, QueryRunner } from 'typeorm'
import { createTable } from "./CreateTable.function";
import { readFile, writeFileSync, unlinkSync, existsSync } from "fs";
import { USVersions } from "./Entitys/USVersions.entity";
import { join } from "path"
import { v4 as uuid } from "uuid";
import { USConfig } from "./Entitys/USConfig.entity";

export class TypeormFileStorage implements BaseFileStore {
    private QueryRunner: QueryRunner;
    private entityManager: EntityManager;

    constructor(private fileDir: string, private dataSource: DataSource) {
        this.QueryRunner = dataSource.createQueryRunner();
        this.entityManager = this.dataSource.manager;
        // createTable(this.QueryRunner);
    }
    public async isRollback(version: string): Promise<boolean> {

        return new Promise(async (resolve, reject) => {
            let usconfig: USConfig[] = await this.entityManager.find(USConfig);

            if (usconfig == null) {
                reject();
            }
            resolve(usconfig[0].isRollback);
        })
    }

    // 获取所有的实体类,用于创建表
    public static GetEntitys() {
        return [USVersions, USConfig];
    }

    /**
     * 读取文件
     * @param version 版本号
     * @returns 文件缓存
     */
    public get(version: string): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            // 取出版本号对应的文件路径
            let usversion: USVersions | null = await this.entityManager.findOne(USVersions, {
                where: {
                    version: version
                }
            })
            // 检查是否存在
            if (usversion == null) {
                reject(new Error(`version ${version} not found`));
            }
            else {
                readFile(join(this.fileDir, usversion.filePath), (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            }
        })
    }

    /**
     * 上传文件
     * @param version 上传的版本号 
     * @param file 文件缓存
     * @returns 是否上传成功
     */
    public upload(version: string, file: Buffer): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                // 生成文件名
                let fileName = `${uuid()}.apk`;

                // 写出文件
                writeFileSync(join(this.fileDir, fileName), file);

                // 保存文件路径
                let usversion: USVersions | null = await this.entityManager.findOne(USVersions, {
                    where: {
                        version: version
                    }
                })

                if (usversion == null) {
                    usversion = new USVersions();
                    usversion.version = version;
                    usversion.filePath = fileName;
                    await this.entityManager.save(usversion);
                    resolve(true);
                }
                else {
                    // 删除旧文件
                    let oldFilePath = join(this.fileDir, usversion.filePath);
                    if (existsSync(oldFilePath)) unlinkSync(oldFilePath)

                    usversion.filePath = fileName;
                    await this.entityManager.save(usversion);
                    resolve(true);
                }
            } catch (err) {
                reject(err);
            }
        })

    }

    // 对应版本目录
    public async getDir(version: string): Promise<string> {
        let usversion: USVersions | null = await this.entityManager.findOne(USVersions, {
            where: {
                version: version
            }
        })

        if (usversion == null) {
            throw new Error(`version ${version} not found`);
        }

        return join(this.fileDir, usversion.filePath);
    }

    // 获取最新版本号
    public async getLatestVersion(): Promise<string> {
        let usconfig: USConfig[] = await this.entityManager.find(USConfig);

        if (usconfig == null) {
            throw new Error(`latestVersion not found`);
        }

        if (usconfig[0].isRollback) {
            return usconfig[0].rollbackVersion;
        }
        return usconfig[0].latestVersion;
    }

    public async getAllVersions(): Promise<string[]> {

        let usversions: USVersions[] = await this.entityManager.find(USVersions);

        if (usversions == null) {
            throw new Error(`latestVersion not found`);
        }

        // 返回版本号列表
        return usversions.map((usversion) => {
            return usversion.version;
        })
    }

    public async has(version: string): Promise<boolean> {
        let usversion: USVersions | null = await this.entityManager.findOne(USVersions, {
            where: {
                version: version
            }
        })

        if (usversion == null) {
            return false;
        }
        else {
            return true;
        }

    }


}