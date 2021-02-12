import {Entity,Column,PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Generated} from 'typeorm';

/** Relationships
 * One to One
 * One to Many
 * Many to Many
 */

@Entity('user_token') // table name
class UserToken{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    @Generated('uuid')
    token:string;

    @Column()
    user_id: string;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;
}

export default UserToken;
