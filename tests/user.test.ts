import request from 'supertest'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

import app from '@root/app'

const prisma = new PrismaClient()

describe('/user', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        name: 'test',
        password: bcrypt.hashSync('test', 10),
      },
    })
  })

  it('should require JWT to create a new user', async () => {
    request(app)
      .post('/user')
      .send({
        name: 'nonexistent',
        password: 'nonexistent',
      })
      .expect(401)
      .expect('Content-Type', /json/)
  })

  it('should return a user by id', async () => {
    const loginResponse = await request(app)
      .post('/auth')
      .send({
        name: 'test',
        password: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const { user } = loginResponse.body

    const userResponse = await request(app)
      .get(`/user/${user.id}`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(userResponse.body.user).toHaveProperty('id')
  })

  it('should remove a user', async () => {
    const loginResponse = await request(app)
      .post('/auth')
      .send({
        name: 'test',
        password: 'test',
      })
      .expect('Content-Type', /json/)
      .expect(200)

    const { user } = loginResponse.body

    await request(app)
      .delete(`/user/${user.id}`)
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
