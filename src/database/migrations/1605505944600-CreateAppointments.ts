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
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone',
                    },
                    {
                        name: 'create_at',
                        type:'timestamp',
                        default:'now()',
                    },
                    {
                        name:'updated_at',
                        type:'timestamp',
                        default:'now()',
                    },
                ],
            }),
        );
    }

    // fallback
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('appoitments');
    }

}
