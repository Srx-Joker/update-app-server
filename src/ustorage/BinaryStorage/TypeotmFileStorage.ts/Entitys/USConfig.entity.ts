import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class USConfig {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type:"varchar",
        length: 20
    })
    latestVersion!: string;

    @Column({
        type:"boolean",
        default: false
    })
    isRollback!: boolean;

    @Column({
        type:"varchar",
        length: 20
    })
    rollbackVersion!: string;
}