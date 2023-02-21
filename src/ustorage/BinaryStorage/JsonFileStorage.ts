import { BaseFileStore } from "./BaseFileStorage";
import { existsSync, mkdirSync, writeFileSync, readFile, readFileSync, writeFile, unlink } from "fs"
import * as uuid from "uuid";
import { Tools } from "../../tools/Tools";
import { join } from "path";


export class JsonFileStorage implements BaseFileStore {


    constructor(private jsonPath: string, private fileDir: string) {

        if (existsSync(this.jsonPath) == false) {
            writeFileSync(jsonPath, JSON.stringify(this.Versions));
            mkdirSync(this.fileDir);
        }
        else {
            this.Versions = JSON.parse(readFileSync(this.jsonPath).toString());
        }
    }

    // 版本号对应的文件
    private Versions:any = {
            latest: "0.0.0",
            versions: {}
    }

    // 获取json文件
    public getJson(): any {
        this.Versions = JSON.parse(readFileSync(this.jsonPath).toString());
        return this.Versions;
    }

    // 修改json文件
    public setJson(json: any) {
        this.Versions = json;
        this.writeJson();
    }

    // 写出json文件
    private writeJson() {
        writeFileSync(this.jsonPath, JSON.stringify(this.Versions));
    }

    // 获取版本号对应的文件
    public get(version: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            if (this.Versions.versions[version] == null) {
                reject(new Error(`version ${version} not found`));
            } else {
                readFile(this.Versions.versions[version], (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
            }
        })
    }

    // 获取版本号对应的文件夹
    public getDir(version: string):string {

        if (this.Versions.versions[version] == null) {
            throw new Error(`version ${version} not found`);
        } else {
            return join(this.fileDir, this.Versions.versions[version]);
        }
    }

    // 上传对应版本文件
    public upload(version: string, file: Buffer): Promise<boolean> {

        let fileName = uuid.v4();
        return new Promise((resolve, reject) => {

            let oldFile =  this.Versions.versions[version];

            writeFile(`${this.fileDir}/${fileName}.apk`, file, (err) => {
                
                if (err) {
                    reject(err);
                }

                this.Versions.versions[version] = `${fileName}.apk`;

                Tools.compareVersion( this.Versions.latest,version) > 0 && (this.Versions.latest = version);

                // console.log("write success");

                this.writeJson();

                if(existsSync(`${this.fileDir}/${oldFile}`)) unlink(`${this.fileDir}/${oldFile}`, (err) => {
                    if (err) {
                        console.log(err);
                    }

                    // console.log("delete old file success");

                })

                resolve(true);
            })


        })
    }

    // 重新读取配置文件
    public readCoinfig() {
        let json = require(this.jsonPath);
        this.Versions = json;
    }

    // 获取最新版本号
    public getLatestVersion(): string {
        return this.Versions.latest;
    }

    // 获取所有版本号
    public getAllVersions(): string[] {
        return Object.keys(this.Versions.versions);
    }

    // 验证版本号是否存在
    public has(version: string): boolean {
        return this.Versions.versions[version] != null;
    }





}