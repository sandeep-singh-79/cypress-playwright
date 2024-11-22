import { Client } from "pg";

export default class DatabaseManager{

    private DBConfig = {
        user: 'db_user',
        password: 'pass',
        database: 'local_db', 
        port: 5477,
      };
      async executeQuery(query: string) {
        const client = new Client(this.DBConfig);
        try {
          await client.connect();
          const result = await client.query(query);
          console.log(result.rows);
        } catch (error) {
          console.error("Error in connection/executing query:", error);
        } finally {
          await client.end().catch((error) => {
            console.error("Error ending client connection:", error);
          });
        }
      };

}