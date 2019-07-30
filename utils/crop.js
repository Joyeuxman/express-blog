const cropty = require('crypto');

// 加密钥匙
const SECURE_KEY = 'ligh&*()==';

// md5加密
const md5 = content => {
  const _md5 = cropty.createHash('md5');
  return _md5.update(content).digest('hex');
};

// 生成加密密码
const genPassword = password => {
  const str = `password=${password}&key=${SECURE_KEY}`;
  return md5(str);
};

// // 测试
// const result = genPassword('123');
// console.log('result===', result);

module.exports = {
  genPassword
};
