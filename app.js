const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const router = require('./router/index');

const app = module.exports = new Koa();
app.use(static(__dirname + '/public')); // 静态
app.use(views(__dirname + '/views')); // 模板
router(app); // 路由


// Constants
const PORT = 3000;
const HOST = '0.0.0.0';
if (!module.parent) app.listen(PORT, HOST, async () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
