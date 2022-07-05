import request from 'supertest'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

import app from '@root/app'

const prisma = new PrismaClient()

describe('/users', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        username: 'test',
        password: bcrypt.hashSync('test', 10),
      },
    })
  })

  it('should require JWT to create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'nonexistent',
        password: 'nonexistent',
      })
      .expect(401)
  })

  it('should return a user by id', async () => {
    const loginResponse = await request(app)
      .post('/auth')
      .send({
        username: 'test',
        password: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const { user } = loginResponse.body

    const userResponse = await request(app)
      .get(`/users/${user.id}`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(userResponse.body.user).toHaveProperty('id')
  })

  it('should remove a user', async () => {
    const loginResponse = await request(app)
      .post('/auth')
      .send({
        username: 'test',
        password: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const { user } = loginResponse.body

    await request(app)
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)

    const userDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(userDatabase).toBeNull()
  })
})
