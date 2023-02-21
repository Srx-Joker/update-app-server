import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("USVersions")
export class USVersions {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    version!: string;

    @Column()
    filePath!: string;

    @Column()
    createTime!: Date;

}