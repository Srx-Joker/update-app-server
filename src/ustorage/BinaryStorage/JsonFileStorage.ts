import { BaseFileStore } from "./BaseFileStorage";
import { existsSync , writeFileSync ,readFile } from "fs"
import * as uuid from "uuid";
import { Tools } from "../../tools/Tools";


export class JsonFileStorage extends BaseFileStore {
    
    constructor(private jsonPath: string, private fileDir: string) {
        super();
        if(!existsSync(this.jsonPath)){
            writeFileSync(jsonPath, `
            {
                "latest": "0.0.0",
                "versions": {
                    
                }
            }`
            );
        }
        else{
            let json = require(this.jsonPath);
            this.Versions = json;
        }

    }

    private Versions: {
        latest: string,
        versions: {
            [version: string]: string
        }
    } = {
        latest: "0.0.0",
        versions: {}
    }


    // 获取版本号对应的文件
    public get(version: string): Promise<Buffer>{
        return new Promise((resolve, reject) => {
            if(this.Versions.versions[version] == null){
                reject(new Error(`version ${version} not found`));
            }else{
                readFile(this.Versions.versions[version], (err, data) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve(data);
                    }
                })
            }
        })
    }

    // 获取版本号对应的文件夹
    public getDir(version: string): Promise<string>{
        return new Promise((resolve, reject) => {
            if(this.Versions.versions[version] == null){
                reject(new Error(`version ${version} not found`));
            }else{
                resolve(this.Versions.versions[version]);
            }
        })
    }

    // 上传对应版本文件
    public upload(version: string, file: Buffer): Promise<void>{
        return new Promise((resolve, reject) => {
            try{
                let fileName = uuid.v4();

                writeFileSync(`${this.fileDir}/${fileName}.apk`,file);
        
                this.Versions.versions[version] = `${this.fileDir}/${fileName}.apk`;
        
                Tools.compareVersion(version, this.Versions.latest) > 0 && (this.Versions.latest = version);

                resolve();
            }catch(e){
                reject(e);
            }
        })
    }

    // 获取最新版本号
    public getLatestVersion(): string{
        return this.Versions.latest;
    }

    // 获取所有版本号
    public getAllVersions(): string[]{
        return Object.keys(this.Versions.versions);
    }

    // 验证版本号是否存在
    public has(version: string): boolean{
        return this.Versions.versions[version] != null;
    }


    
    

}