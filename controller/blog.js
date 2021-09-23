// controller 用来管理数据，理解为数据控制层
// controller 拿到对应路由的数据，与数据库建立连接交互，获取数据并返回给路由

const { exec, escape } = require('../db/mysql.js')
const xss = require('xss')

const getList = async (author, keyword) => {
  // 当 author 和 keyword 不存在，1=1 起到占位作用 
  let sql = `select * from blogs where 1=1 `
  if (author) {
    author = escape(author)
    sql += `and author=${author} `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  return await exec(sql)
}

const getDetail = async (id) => {
  id = escape(id)
  const sql = `select * from blogs where id=${id}`
  const rows = await exec(sql)
  return rows[0]
}

const newBlog = async (blogData = {}) => {
  // blogData 是一个博客对象，包含 title content author 属性
  const title = xss(blogData.title)
  const content = escape(blogData.content)
  const author = escape(blogData.author)
  const createTime = Date.now()

  const sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', ${content}, ${createTime}, ${author})
  `
  const insertData = await exec(sql)
  return insertData.insertId
}

const updateBlog = async (id, blogData = {}) => {
  // id 就是更新博客的 id
  // blogData 是一个博客对象，包含 title content 属性
  // console.log('updata blog...', id, blogData)
  const title = xss(blogData.title)
  const content = escape(blogData.content)
  id = escape(id)
  const sql = `
    update blogs set title='${title}', content=${content} where id=${id}
  `
  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true
  }
  return false
}

const deleteBlog = async (id, author) => {
  author = escape(author)
  id = escape(id)
  const sql = ` 
    delete from blogs where id=${id} and author=${author}
  `
  const deleteData = await exec(sql)
  if (deleteData.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}


