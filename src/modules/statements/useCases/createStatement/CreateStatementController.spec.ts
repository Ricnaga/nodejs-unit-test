import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { app } from '../../../../app';

let connection: Connection;

describe('Create Statement Controller', () => {
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

  it('should be able to do deposits', async () => {
    const responseSessions = await request(app).post('/api/v1/sessions').send({
      email: 'admin@email.com.br',
      password: 'admin'
    })

    const { token } = responseSessions.body

    const responseDeposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 200,
        description: "Deposit test",
      }).set({
        Authorization: `Bearer ${token}`,
      })

    expect(responseDeposit.status).toBe(201);
  })

  it('should be able to do withdraws', async () => {
    const responseSessions = await request(app).post('/api/v1/sessions').send({
      email: 'admin@email.com.br',
      password: 'admin'
    })

    const { token } = responseSessions.body

    await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 200,
        description: "Deposit test",
      }).set({
        Authorization: `Bearer ${token}`,
      })

    const responseWithdraw = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 100,
        description: "Deposit test",
      }).set({
        Authorization: `Bearer ${token}`,
      })

    expect(responseWithdraw.status).toBe(201);
  })
})
