import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { app } from '../../../../app';

let connection: Connection;

describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash("admin", 8);

    await connection.query(`
        INSERT INTO users( id, name, email, password, created_at, updated_at )
        values('${id}', 'admin', 'admin@email.com.br', '${password}', 'now()', 'now()')
    `);
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list an authenticated user', async () => {
    const responseSessions = await request(app).post('/api/v1/sessions').send({
      email: 'admin@email.com.br',
      password: 'admin'
    })

    const { token } = responseSessions.body

    const responseProfile = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`,
      });

      expect(responseProfile.status).toBe(200);
      expect(responseProfile.body.name).toEqual("admin");
  })
})
