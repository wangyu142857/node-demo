const router = require('koa-router')();
const proxy = require('../utils/proxy');
const config = require('../config');

/**
 *
 * ```javascript
 * router
 *   .get('/', (ctx, next) => {})
 *   .post('/users', (ctx, next) => {})
 *   .put('/users/:id', (ctx, next) => {})
 *   .del('/users/:id', (ctx, next) => {})
 *   .all('/users/:id', (ctx, next) => {});
 * ```
 */
// 添加路由
router.get('/', async (ctx, next) => {
  await ctx.render('index')
})
router.get('/content', async (ctx, next) => {
  await ctx.render('content')
})
router.get('/detail', async (ctx, next) => {
  await ctx.render('detail')
})


router.get('/search', async (ctx, next) => {
  const name = encodeURI(ctx.query.name);
  const page = ctx.query.page;
  let url = config.search + name;
  if (page) {
    url += `&p=${page}`
  }
  const res = await proxy.search(url, page);
  ctx.body = res
})
router.get('/getContent', async (ctx, next) => {
  const url = ctx.query.url;
  const res = await proxy.getContent(url);
  ctx.body = res
})
router.get('/getDetail', async (ctx, next) => {
  const url = ctx.query.url;
  const res = await proxy.getDetail(url);
  ctx.body = res
})

module.exports = app => {
  app.use(router.routes(), router.allowedMethods()); // 路由中间件
};
