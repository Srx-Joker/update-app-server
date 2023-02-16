import { BaseFileStore } from "../ustorage/BinaryStorage/BaseFileStorage"


export class UUpload {
    constructor(
        private BaseFileStore: BaseFileStore,
        private retry: number,
        private afterUpload?: (version: string) => void

    ) {

    }
    
    public async upload (version: string, file: Buffer) : Promise<boolean>{
        for (let i = 0; i < this.retry; i++) {
            try {
                let isSuccess = await this.BaseFileStore.upload(version, file)
                if (this.afterUpload) {
                     this.afterUpload(version)
                }
                return isSuccess;
            } catch (error) {
                throw error
            }
        }
        return false;
    }


}