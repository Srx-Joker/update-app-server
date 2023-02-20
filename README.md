# APP更新服务端库

## 介绍

本库使用 TypeSctipt 开发，提供最基本的下载方式不包含业务逻辑。



## 使用方式介绍

### 开始使用

1. 创建一个类作为APP更新的工具类
2. 导入UpdateApp类并继承
3. 根据业务实现回调函数



#### 导入UpdateApp.

```typescript
// 导入一个基础类
import { UpdateApp , JsonFileStorage } from "update-app"
```



#### 继承并实现回调函数.

注意事项:

	1. 需要将数据源传递到父类构造 Super
	1. 在调用Start 或者 Upload 方法的时候可以传一个dist对象 该对象会覆盖整个流程

```typescript
import { UpdateApp , JsonFileStorage, Tools} from "update-app"

export class UpdateService extends UpdateApp{
    constructor() {
        // 初始化数据源并传递到父类
        // 目前只实现了JsonFile 使用Json和文件作为存储的数据源
        let jsonFile = "../package/version.json";
        let packPath = "../package/packs";
        let jsonFileStorage = new JsonFileStorage(join(__dirname,jsonFile) ,join(__dirname,packPath))
        super(jsonFileStorage)
    }
     
    /**
     * 下载开始前回调
     * @param version 最新版本号
     * @param next 同意下载
     * @param refuse 拒绝下载
     */
    BeginDownload(version: string, next: (version: string) => void, refuse: ()=>void, dist: any):void {
   		console.log("下载回调");
    }

     /**
     * 上传开始回调
     * @param version 
     * @param next 同意上传
     * @param refuse 拒绝上传
     */
    BegineUpload(version: string, next: (version: string) => void, refuse: Function, dist: any): void {
        console.log("上传回调");
    }

    AfterDownload(file: string | Buffer,dist):void { 
        console.log("下载完成")
    }
    RefuseDownload(version: string,dist):void {
        console.log("下载失败-拒绝下载")
    }
    
    AfterUpload(version: string,dist):void {
        console.log("上传完成")
    }
    RefuseUpload(dist): void {
        console.log("上传失败-拒绝上传")
    }
}
```

