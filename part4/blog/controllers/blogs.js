const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user',{ username: 1, name: 1 })

    response.json(blogs)
})

blogRouter.post('/', middleware.useExtractor, async(request, response) => {
    const body = request.body
    const user = request.user

    if(!body.title || !body.url){
        return response.status(400).json({ error: 'title or url is missing' })
    }

    if(!request.token){
        return response(401).json({ error: 'token invalid' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        user: user._id,
        likes: body.likes || 0
    })

    if(user._id.toString() === blog.user.toString()){
        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    }else{
        response.status(401).json({ error: 'unauthorized' })
    }

})

blogRouter.delete('/:id', middleware.useExtractor, async (request, response) => {

    const user = request.user

    if(!request.token){
        return response.status(401).json({ error: 'token is missing' })
    }

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() === user._id.toString()){
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }else{
        return response.status(401).json({ error: 'can\'t access the blog' })
    }
})

blogRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes, userId } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes, userId }, { new: true })

    response.json(updatedBlog)
})

module.exports = blogRouter