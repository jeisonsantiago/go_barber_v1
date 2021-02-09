import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAvatarFieldToUsers1605678208412 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.addColumn('users', new TableColumn({
            name: 'image_avatar',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'image_avatar');
    }

}
