export class Tools{
    
    /**
     * String转换为Number
     * @param version 版本号
     * @returns 版本号数字
     */
    private static parseVersion(version : string):number{
        // 版本号为空
        if(version == null || version == undefined || version == ""){
            return 0;
        }

        // 版本号不是字符串
        let versionArr = version.split(".");
        let versionNum = 0;

        // 版本号不是数字
        for(let i = 0; i < versionArr.length; i++){
            versionNum += Number(versionArr[i]) * Math.pow(10, (versionArr.length - i - 1) * 2);
        }
        
        return versionNum;

    }

    /**
     * 检查是否需要更新版本
     * @param oldv 旧版本
     * @param newv 新版本
     * @returns 0:不需要更新 1:需要更新 -1:参数错误
     */
    public static compareVersion(oldv : string, newv : string):number{   
        if(this.parseVersion(oldv) >= this.parseVersion(newv)){
            return 0;
        }
        else if(this.parseVersion(oldv) < this.parseVersion(newv)){
            return 1;
        }
        else{
            return -1;
        }

    }

}