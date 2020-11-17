import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointments1605505944600 implements MigrationInterface {

    // updates
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'appointments',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid', // generate automatic id through uuid()
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'provider',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone',
                        isNullable: false,
                    }
                ]
            })
        );
    }

    // fallback
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('appoitments');
    }

}
