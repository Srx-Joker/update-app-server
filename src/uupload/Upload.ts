import { BaseFileStore } from "../ustorage/BinaryStorage/BaseFileStorage"


export class UUpload {
    constructor(
        private BaseFileStore: BaseFileStore,
        private retry: number,
        private afterUpload?: (version: string, dist:any) => void

    ) {

    }
    
    public async upload (version: string, file: Buffer, dist:any) : Promise<boolean>{
        for (let i = 0; i < this.retry; i++) {
            try {
                let isSuccess = await this.BaseFileStore.upload(version, file)
                if (this.afterUpload) {
                     this.afterUpload(version, dist)
                }
                return isSuccess;
            } catch (error) {
                throw error
            }
        }
        return false;
    }


}