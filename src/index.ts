
import { UDownload } from "./udownload/Download";
import { BaseFileStore } from "./ustorage/BinaryStorage/BaseFileStorage";
import { UUpload } from "./uupload/Upload";

export class UpdateApp {
    constructor(
        private BaseBinaryStore: BaseFileStore,
        private dretry:number = 5,
        private uretry:number = 5,
    ){};

    public BeginDownload?: (version: string, next:(version:string)=>void, refuse:Function) => Promise<void>;
    public AfterDownload?: (file: Buffer|string) => Promise<void>;
    public RefuseDownload?: (version: string) => Promise<void>;
    public BegineUpload?: (version: string) => Promise<void>;
    public AfterUpload?: (version: string) => Promise<void>;
    

    
    public async start(file:boolean = true): Promise<void> {
        const download = new UDownload(this.BaseBinaryStore,this.dretry,this.AfterDownload,file);
        const version = this.BaseBinaryStore.getLatestVersion();

        const next = (nversion:string) => {
            if(nversion){
                download.download(nversion);
            }
            else{
                download.download(version);
            };
        }  

        const refuse = () => {
            this.RefuseDownload?.(version);
        }

        await this.BeginDownload?.(version,next,refuse);   
    }

    public async upload(file: Buffer, version: string): Promise<void> {
        const upload = new UUpload(this.BaseBinaryStore,this.uretry,this.AfterUpload);
        this.BegineUpload?.(version);
        await upload.upload(version,file);
    }



}