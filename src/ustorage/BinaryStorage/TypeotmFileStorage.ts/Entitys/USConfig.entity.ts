import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("USConfig")
export class USConfig {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    latestVersion!: string;
}