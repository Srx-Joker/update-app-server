import { BaseFileStore } from "../ustorage/BinaryStorage/BaseFileStorage";

export class UDownload{
    constructor(
        // 文件存储器
        private BaseBinaryStore:BaseFileStore,

        // 下载重试次数
        private retry:number,

        // 下载完成后回调
        private AfterDownload?: (file: Buffer|string ) => Promise<void>,

        // 下载文件还是文件夹
        private file = true,
        ){
        
    }

    /**
     * 开始下载对应版本号的文件
     * @param version 版本号
     * @returns 没有
     */
    public async download(version: string) {

        for(let i = 0; i < this.retry; i++){
            // 如果文件不存在则跳过
            if(!this.BaseBinaryStore.has(version)){
                console.log("Download failed version not found.");
                break;
            }
            
            let file = null;
            
            if(this.file){
                 file = await this.BaseBinaryStore.get(version);
            }
            else{
                file = await this.BaseBinaryStore.getDir(version);
            }

            if(file){
                await this.AfterDownload?.(file);
                return;        
            }
        }

        console.log("Download failed.");

    }
}