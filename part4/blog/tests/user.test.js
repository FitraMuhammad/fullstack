const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username:'root', passwordHash })

        await user.save()
    }, 50000)

    test('creation succeeds with a fresh username', async() => {
        const userAtStart = await helper.userInDb()

        const newUser = {
            username: 'jack',
            name: 'Jack Black',
            password: 'secret'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.userInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length + 1)

        const username = userAtEnd.map(u => u.username)
        expect(username).toContain(newUser.username)
    })

    test('creation fails with proper status code if username has already taken', async () => {
        const userAtStart = await helper.userInDb()

        const newUser = {
            username: 'root',
            password: 'secret'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const error = result.body.error
        expect(error).toContain('`username` to be unique')

        const userAtEnd = await helper.userInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length)
    })

    test('creation fails with proper status code if username less than 3 characters', async () => {
        const userAtStart = await helper.userInDb()

        const newUser = {
            username: 'ro',
            password: 'secret'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const error = result.body.error
        expect(error).toContain('is shorter than the minimum allowed length (3)')

        const userAtEnd = await helper.userInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length)
    })

    test('creation fails with proper status code if password less than 3 characters', async () => {
        const userAtStart = await helper.userInDb()

        const newUser = {
            username: 'simon',
            password: 'sm'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const error = result.body.error
        expect(error).toContain('password must be at least 3 characters')

        const userAtEnd = await helper.userInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})