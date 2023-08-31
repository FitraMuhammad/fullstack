const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


beforeAll(async () => {
    await User.deleteMany({})
    const user = {
        username: 'user',
        name: 'test user',
        password: 'secret'
    }

    await api
    .post('/api/users')
    .send(user)
    .set('Accept', /application\/json/)
    .expect('Content-Type', /application\/json/)
}, 50000)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObject = helper.intialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)

}, 100000)

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async() => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('unique identifier property is named id', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogAtEnd = blogAtStart[0]

        expect(blogAtEnd.id).toBeDefined()
    })
})

describe('addition of a new blog', () => {

    test('successfully creates a new blog post', async () => {
        
        const loginUser = {
            username: 'user',
            password: 'secret'
        }

       const user = await api
        .post('/api/login')
        .send(loginUser)
        .expect('Content-Type', /application\/json/)
        
        const newBlog = {
            title: 'new blog',
            author: 'Dave mustaine',
            url: 'http://test',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user.body.token}`)
            .send(newBlog)
            .expect(201)

        const blogAtEnd = await helper.blogsInDb()

        expect(blogAtEnd).toHaveLength(helper.intialBlogs.length + 1)
    })

    test('verifies that if the likes property is missing it will default to the value 0', async () => {
        const userLogin = {
            username: 'user',
            password: 'secret'
        }

        const user = await api
        .post('/api/login')
        .send(userLogin)
        .expect('Content-Type', /application\/json/)

        const newBlog = {
            title: 'new blog',
            author: 'Dave mustaine',
            url: 'http://test'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user.body.token}`)
            .send(newBlog)
            .expect(201)

        const blogAtEnd = await helper.blogsInDb()
        const blogToTest = blogAtEnd[blogAtEnd.length - 1]

        expect(blogToTest.likes).toBe(0)
    })

    test('if title missing status code is 400', async () => {
        const userLogin = {
            username: 'user',
            password: 'secret'
        }

        const user = await api
        .post('/api/login')
        .send(userLogin)
        .expect('Content-Type', /application\/json/)

        const newBlog = {
            author: 'Dave mustaine',
            url: 'http://test'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user.body.token}`)
            .send(newBlog)
            .expect(400)

        const blogAtEnd = helper.intialBlogs

        expect(blogAtEnd).toHaveLength(blogAtEnd.length)
    })

    test('if url missing status code is 400', async () => {
        const userLogin = {
            username: 'user',
            password: 'secret'
        }

        const user = await api
        .post('/api/login')
        .send(userLogin)
        .expect('Content-Type', /application\/json/)

        const newBlog = {
            title: 'new blog',
            author: 'Dave mustaine'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${user.body.token}`)
            .send(newBlog)
            .expect(400)

        const blogAtEnd = helper.intialBlogs

        expect(blogAtEnd).toHaveLength(blogAtEnd.length)
    })
})

describe('deletion of a blog', () => {
    test('succeed with statuscode 204 if id is valid', async () => {

        const userLogin = {
            username: 'user',
            password: 'secret'
          }
      
          const user = await api
            .post('/api/login')
            .send(userLogin)
            .expect('Content-Type', /application\/json/)
          
          const decodedToken = jwt.verify(user.body.token, process.env.SECRET)

          const blog = {
            title: 'test',
            author: user.body.name,
            url: '-',
            user: decodedToken.id
          }

          const blogToDelete = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${user.body.token}`)
          .send(blog)

          await api
            .delete(`/api/blogs/${blogToDelete.body.id}`)
            .set('Authorization', `Bearer ${user.body.token}`)
            .expect(204)
      
          const blogsAtEnd = await helper.blogsInDb()
      
          expect(blogsAtEnd).toHaveLength(helper.intialBlogs.length)
    })
})

describe('update a blog', () => {
    test('succeed with statuscode 200 if id is valid', async () => {
        const blogAtStart = await helper.blogsInDb()

        const blogToUpdate = blogAtStart[0]
        const newBlog = {
            ...blogToUpdate,
            likes: 20
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
            .expect(200)

        const blogAtEnd = await helper.blogsInDb()
        const likes = blogAtEnd[0].likes

        expect(likes).toEqual(newBlog.likes)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})