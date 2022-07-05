import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import app from '@root/app'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

describe('Authentication', () => {
  it('should be able to login', async () => {
    await prisma.user.create({
      data: {
        username: 'testAuth',
        password: bcrypt.hashSync('test', 10),
      },
    })

    const response = await request(app)
      .post('/auth')
      .send({
        username: 'testAuth',
        password: 'test',
      })
      .expect(200)
    expect(response.body.user).toHaveProperty('token')
  })

  it('should fail with unknown user', async () => {
    await request(app)
      .post('/auth')
      .send({
        username: 'unknownUser',
        password: 'test',
      })
      .expect(401)
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        username: 'testAuth',
      },
    })
  })
})
