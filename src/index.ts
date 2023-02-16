
import { UDownload } from "./udownload/Download";
import { BaseFileStore } from "./ustorage/BinaryStorage/BaseFileStorage";
import { UUpload } from "./uupload/Upload";

export class UpdateApp {
    constructor(
        // 文件存储器
        private BaseFileStore: BaseFileStore,

        // 下载重试次数
        private dretry:number = 5,

        // 上传重试次数
        private uretry:number = 3,
    ){};

    /**
     * 下载开始前回调
     * @param version 最新版本号
     * @param next 同意下载
     * @param refuse 拒绝下载
     */
    public BeginDownload?: (version: string, next:(version:string)=>void, refuse:Function) => Promise<void>;

    /**
     * 下载完成后回调
     * @param file 文件 | 文件路径 ( 取决于下载器对象的初始化最后一个参数 )
     * @param version 版本号
     */
    public AfterDownload?: (file: Buffer|string) => Promise<void>;

    /**
     * 拒绝下崽回调
     * @param version 版本号
     */
    public RefuseDownload?: (version: string) => Promise<void>;

    // 上传开始前回调
    public BegineUpload?: (version: string) => Promise<void>;

    // 上传完成后回调
    public AfterUpload?: (version: string) => Promise<void>;
    

    // 开始下载 
    public async start(file:boolean = true): Promise<void> {
        // 初始化下崽器对象
        const download = new UDownload(this.BaseFileStore,this.dretry,this.AfterDownload,file);

        // 获取最新版本号
        const version = this.BaseFileStore.getLatestVersion();

        /**
         * 同意下载
         * @param nversion 指定下载的版本号
         */
        const next = (nversion:string) => {
            if(nversion || this.BaseFileStore.has(nversion)){
                download.download(nversion);
            }
            else{
                download.download(version);
            };
        }  

        // 拒绝下载
        const refuse = () => {
            this.RefuseDownload?.(version);
        }

        // 开始下载
        await this.BeginDownload?.(version,next,refuse);   
    }

    /**
     * 上传文件
     * @param file 文件
     * @param version 文件版本号
     */
    public async upload(file: Buffer, version: string): Promise<void> {
        // 初始化上传器对象
        const upload = new UUpload(this.BaseFileStore,this.uretry,this.AfterUpload);

        // 开始上传前回调
        this.BegineUpload?.(version);
        
        // 开始上传
        await upload.upload(version,file);
    }



}