import { Table } from "typeorm"
import { QueryRunner } from "typeorm/query-runner/QueryRunner"

export function createTable(QueryRunner: QueryRunner): Promise<void> {

    // 创建数据库表
    return new Promise((resolve, reject) => {

        // 表名
        let tables:any = {
            USVersions: false,
            USConfig: false,
        }

        // 返回函数
        let retfunc = (table:string) => {
            tables[table] = true;
            let all = true;
            for (let key in tables) {
                if (tables[key] == false) {
                    all = false;
                    break;
                }
            }
            
            if (all) {
                resolve();
            }
        }

        // UsVersions
        QueryRunner.hasTable("USVersions").then((hasTable) => {
            if (!hasTable) {
                QueryRunner.createTable(
                    new Table({
                        name: "USVersions",
                        columns: [
                            {
                                name: "id",
                                type: "int",
                                isPrimary: true,
                                isNullable: false,
                                isGenerated: true,
                            },
                            {
                                name: "version",
                                type: "varchar",
                                isNullable: false,
                            },
                            {
                                name: "filePath",
                                type: "varchar",
                                length: "255",
                                isNullable: false,
                            },
                            {
                                name: "createTime",
                                type: "datetime",
                                isNullable: false,
                                default: "CURRENT_TIMESTAMP",
                            }
                        ]
                    }
                    )
                ).then(() => {
                    retfunc("USVersions");
                })
            } else {
                retfunc("USVersions");
            }
        }
        )



        // USConfig
        QueryRunner.hasTable("USConfig").then((hasTable) => {
            if (!hasTable) {
                QueryRunner.createTable(
                    new Table({
                        name: "USConfig",
                        columns: [
                            {
                                name: "id",
                                type: "int",
                                isPrimary: true,
                                isNullable: false,
                                isGenerated: true,
                            },
                            {
                                name: "latestVersion",
                                type: "varchar",
                                isNullable: false,
                                length: "255",
                            },
                        ]
                    }
                    )
                ).then(() => {
                    retfunc("USConfig");
                })
            } else {
                retfunc("USConfig");
            }
        }
        )

    })

}