import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class USVersions {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type:"varchar",
        length: 20
    })
    version!: string;

    @Column({
        type:"varchar",
        length: 255
    })
    filePath!: string;

    @Column({
        type:"date"
    })
    createTime!: Date;

}