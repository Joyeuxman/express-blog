const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = (author, keyword) => {
  // where 1=1 妙用 保证了sql语句的正确性(无论author/keyword是否存在)
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}'`;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`;
  }
  sql += `order by createtime desc`;

  // 返回promise
  return exec(sql);
};

const getDetail = id => {
  const sql = `select * from blogs where id='${id}'`;
  // 返回一个promise
  return exec(sql).then(rows => {
    return rows[0];
  });
};

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含title content author 属性

  let { title, content, author } = blogData;
  // 使用xss包来避免XSS攻击
  title = xss(title);
  const createtime = Date.now();
  console.log('预防XSS,title===',title);
  const sql = `
  insert into blogs (title,content,author,createtime)
  values ('${title}','${content}','${author}',${createtime})
  `;
  return exec(sql).then(insertData => {
    // console.log('insertData===',insertData);
    return {
      id: insertData.insertId
    };
  });
};

const updateBlog = (id, blogData = {}) => {
  // id 即将更新博客的id
  // blogData 是一个博客对象，包含title content 属性

  const { title, content } = blogData;
  const sql = `update blogs set title='${title}', content='${content}' where id='${id}'`;
  return exec(sql).then(updateData => {
    // console.log('updateData === ', updateData);
    if (updateData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

const delBlog = (id,author) => {
  // id 就是要删除博客的id
  const sql = `delete from blogs where id = '${id}' and author='${author}'`;
  return exec(sql).then(delData => {
    console.log('delData === ', delData);
    if (delData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
