export declare class BaseFileStore {

    // 获取版本号对应的文件
    public get(version: string): Promise<Buffer>;

    // 获取版本号对应的文件夹
    public getDir(version: string):string|Promise<string>;

    // 上传对应版本文件
    public upload(version: string, file: Buffer): Promise<boolean>;

    // 获取最新版本号
    public getLatestVersion(): string | Promise<string>;

    // 获取所有版本号
    public getAllVersions(): string[] | Promise<string[]>;

    // 验证版本号是否存在
    public has(version: string): boolean | Promise<boolean>;

    // 检查是否为回滚状态
    public isRollback(): boolean | Promise<boolean>;

}