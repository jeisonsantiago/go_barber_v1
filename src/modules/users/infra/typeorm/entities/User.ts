import {Entity,Column,PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';

/** Relationships
 * One to One
 * One to Many
 * Many to Many
 */

@Entity('users') // table name
class User{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('varchar')
    name:string;

    @Column('varchar')
    email:string;

    @Column('varchar')
    password:string;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;

    @Column('varchar')
    image_avatar:string;
}

export default User;
