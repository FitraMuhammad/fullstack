const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (listBlog) => {
    const result = listBlog.map(blog => blog.likes)

    const reducer = (sum, item) => {
        return sum + item
    }

    return result.reduce(reducer, 0)
}

const favoriteBlog = (listBlog) => {
    const likes = listBlog.map(blog => blog.likes)
    const mostLike = Math.max(...likes)

    return listBlog.length === 0
        ? 0
        : listBlog.find(blog => blog.likes === mostLike)
}

const mostBlogs = (blogs) => {
    const groupedBlog = _.groupBy(blogs, (o) => o.author)
    const authors = _.mapValues(groupedBlog, (o) => o.length)

    const mostBlog = Math.max(...Object.values(authors))
    const author = Object.keys(authors).find(key => authors[key] === mostBlog)

    return blogs.length === 0
        ? 0
        : { author: author, blogs: mostBlog }
}

const mostLikes = (blogs) => {
    const groupedBlog = _.groupBy(blogs, (o) => o.author)
    const likes = _.mapValues(groupedBlog, totalLikes)

    const mostLike = Math.max(...Object.values(likes))
    const author = Object.keys(likes).find(key => likes[key] === mostLike)

    return blogs.length === 0
        ? 0
        : { author: author, likes: mostLike }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}