import { BaseFileStore } from "../ustorage/BinaryStorage/BaseFileStorage"


export class UUpload {
    constructor(
        private BaseFileStore: BaseFileStore,
        private retry: number,
        private afterUpload?: (version: string) => void

    ) {

    }
    
    public async upload (version: string, file: Buffer) {
        for (let i = 0; i < this.retry; i++) {
            try {
                await this.BaseFileStore.upload(version, file)
                if (this.afterUpload) {
                    await this.afterUpload(version)
                }
                break
            } catch (error) {
                console.log(error)
            }
        }
    }


}