import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import uploadConfig from '@config/upload';
/** Relationships
 * One to One
 * One to Many
 * Many to Many
 */

import { Exclude, Expose } from 'class-transformer';

@Entity('users') // table name
class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('varchar')
  image_avatar: string;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {

    if (!this.image_avatar) return null;

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.image_avatar}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.us-east-2.amazonaws.com/${this.image_avatar}`
      default:
        return null;
    }
  }
}

export default User;
