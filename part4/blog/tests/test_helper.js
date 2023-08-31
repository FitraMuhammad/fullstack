const Blog = require('../models/blog')
const User = require('../models/user')

const intialBlogs = [
    {
        title: 'test',
        author: 'Jane Doe',
        url: 'http://test',
        likes: 10,
    },
    {
        title: 'test 2',
        author: 'John Doe',
        url: 'http://test',
        likes: 0,
    },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const userInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}


module.exports = {
    intialBlogs,
    blogsInDb,
    userInDb
}