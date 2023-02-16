import { BaseFileStore } from "../ustorage/BinaryStorage/BaseFileStorage";

export class UDownload{
    constructor(
        private BaseBinaryStore:BaseFileStore,
        private retry:number,
        private AfterDownload?: (file: Buffer|string ) => Promise<void>,
        private file = true,
        ){
        
    }

    public async download(version: string) {

        for(let i = 0; i < this.retry; i++){
            if(!this.BaseBinaryStore.has(version)){
                console.log("Download failed version not found.");
                continue;
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