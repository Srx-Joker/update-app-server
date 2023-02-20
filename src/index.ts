
import { Tools } from "./tools/Tools";
import { UDownload } from "./udownload/Download";
import { BaseFileStore } from "./ustorage/BinaryStorage/BaseFileStorage";
import { JsonFileStorage } from "./ustorage/BinaryStorage/JsonFileStorage";
import { UUpload } from "./uupload/Upload";

abstract class UpdateApp {
    constructor(
        // 文件存储器
        private BaseFileStore: BaseFileStore,

        // 下载重试次数
        private dretry: number = 5,

        // 上传重试次数
        private uretry: number = 3,
    ) { };

    /**
     * 下载开始前回调
     * @param version 最新版本号
     * @param next 同意下载
     * @param refuse 拒绝下载
     */
    abstract  BeginDownload(version: string,  next: (version: string) => void, refuse: Function,dist:any):any;

    /**
     * 下载完成后回调
     * @param file 文件 | 文件路径 ( 取决于下载器对象的初始化最后一个参数 )
     * @param version 版本号
     */
    abstract AfterDownload (file: Buffer | string, dist:any):any;

    /**
     * 拒绝下崽回调
     * @param version 版本号
     */
    abstract RefuseDownload (version: string, dist:any):any;

    /**
     * 拒绝上传回调
     */
    abstract RefuseUpload (dist:any):any;

    // 上传开始前回调
    abstract BegineUpload (version: string , next: (version: string) => void, refuse: Function,dist:any):any;

    // 上传完成后回调
    abstract AfterUpload (version: string, dist:any):any;


    // 开始下载 
    public async start(file: boolean = false,dist?:any): Promise<void> {
        // 初始化下崽器对象
        const download = new UDownload(this.BaseFileStore, this.dretry, this.AfterDownload, file);

        // 获取最新版本号
        const version = this.BaseFileStore.getLatestVersion();

        /** 
         * 同意下载
         * @param nversion 指定下载的版本号
         */
        const next = (nversion: string) => {
            if (nversion || this.BaseFileStore.has(nversion)) {
                download.download(nversion, dist);
            }
            else {
                download.download(version, dist);
            };
        }

        // 拒绝下载
        const refuse = () => {
            this.RefuseDownload?.(version, dist);
        }

        // 开始下载
        await this.BeginDownload?.(version, next, refuse,dist);
    }

    /**
     * 上传文件
     * @param file 文件
     * @param version 文件版本号
     */
    public async upload(file: Buffer, version: string, dist?:any): Promise<void> {
        // 初始化上传器对象
        const upload = new UUpload(this.BaseFileStore, this.uretry, this.AfterUpload);

        /**
         * 同意上传
         */
        const next = (nversion: string) => {
            upload.upload(nversion, file, dist);
        }

        // 拒绝上传
        const refuse = () => {
            this.RefuseUpload?.(dist);
        }
        

        // 开始上传前回调
        this.BegineUpload?.(version, next, refuse,dist);
    }


}

export { BaseFileStore, JsonFileStorage, UpdateApp ,Tools};