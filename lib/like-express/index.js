const http = require('http');
const slice = Array.prototype.slice;

class likeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [], // use
      get: [], // get
      post: [] // post
    };
  }

  register(path) {
    const info = {};
    if (typeof path === 'string') {
      info.path = path;
      // 从第二个参数开始，存入info.stack
      info.stack = slice.call(arguments, 1);
    } else {
      info.path = '/';
      // 从第一个参数开始，存入info.stack
      info.stack = slice.call(arguments, 0);
    }
    return info;
  }

  all() {
    const info = this.register.apply(this, arguments);
    this.routes.all.push(info);
  }

  get() {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }

  post() {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }

  // 实现 next 核心机制
  handle(req,res,list) {
    const next = () => {
      const middleware = list.shift();
      if (middleware) {
        // 调用中间件
        middleware(res, req, next);
      }
    };
    next();
  }

  match(method, url) {
    let stack = [];
    if (url === '/favicon.ico') {
      return stack;
    }

    let currentRoutes = [];
    currentRoutes = currentRoutes.concat(this.routes.all);
    currentRoutes = currentRoutes.concat(this.routes[method]);
    currentRoutes.forEach(routeInfo => {
      // url = '/api/getCookie' 且 routeInfo.path = '/'
      // url = '/api/getCookie' 且 routeInfo.path = '/api'
      // url = '/api/getCookie' 且 routeInfo.path = '/api/getCookie'
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack);
      }
    });
    return stack;
  }

  callback() {
    return (req, res) => {
      res.json = data => {
        res.headers['Content-type'] = 'application/json';
        res.end(JSON.stringify(data));
      };
      const url = req.url;
      const method = req.method.toLowerCase();
      const resultList = this.match(method, url);
      this.handle(req,res,resultList);
    };
  }

  listen(...args) {
    const server = http.createServer(this.callback);
    server.listen(...args);
  }
}

// 工厂函数
module.exports = () => {
  return new likeExpress();
};
