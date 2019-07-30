var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog');
const loginCheck = require('../middle/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 获取博客列表
router.get('/list', function(req, res) {
  let author = req.query.author || '';
  const keyword = req.query.keyword || '';

  if (req.query.isadmin) {
    //管理员界面
    if (req.session.username == null) {
      return res.json(new ErrorModel('未登录'));
    }
    //强制查询自己的博客
    author = req.session.username;
  }

  const result = getList(author, keyword);
  return result.then(data => {
    res.json(new SuccessModel(data));
  });
});

// 获取博客详情
router.get('/detail', function(req, res) {
  const { id = '' } = req.query;
  const result = getDetail(id);
  return result.then(data => {
    return res.json(new SuccessModel(data));
  });
});

// 新建一篇博客
router.post('/new', loginCheck, function(req, res) {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then(data => {
    return res.json(new SuccessModel(data));
  });
});

// 更新一篇博客
router.post('/update',loginCheck, function(req, res) {
  const { id = '' } = req.query;
  const result = updateBlog(id, req.body);
  return result.then(data => {
    if (data) {
      return res.json(new SuccessModel());
    } else {
      return res.json(new ErrorModel('更新博客失败'));
    }
  });
});

// 删除一篇博客
router.post('/del', loginCheck, function(req, res) {
  const { id = '' } = req.query;
  const author = req.session.username;
  // 只有作者自己才能删除自己的博客
  const result = delBlog(id, author);
  return result.then(data => {
    if (data) {
      return res.json(new SuccessModel());
    } else {
      return res.json(new ErrorModel('删除博客失败'));
    }
  });
});

module.exports = router;
