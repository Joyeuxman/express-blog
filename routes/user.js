var express = require('express');
var router = express.Router();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 登录
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const result = login(username, password);
  return result.then(data => {
    if (data.username) {
      //登录成功
      //设置session
      req.session.username = data.username;
      req.session.realname = data.realname;

      return res.json(new SuccessModel());
    }
    res.json(new ErrorModel('登录失败'));
  });
});


// session 测试
router.get('/session-test', function(req, res, next) {
  if (req.session.viewNum === undefined) {
    req.session.viewNum = 0;
  }
  req.session.viewNum++;
  res.json({
    viewNum: req.session.viewNum
  });
});
module.exports = router;
