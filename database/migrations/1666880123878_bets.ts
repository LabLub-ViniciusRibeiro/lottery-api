import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('secure_id').notNullable().unique()
      table
        .uuid('user_id')
        .notNullable()
        .references("secure_id")
        .inTable("users")
        .onDelete('CASCADE')
      table
        .integer('game_id')
        .unsigned()
        .references("id")
        .inTable("games")
        .onDelete('CASCADE')
        .notNullable()
      table.string('chosen_numbers').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
