const router = require('koa-router')();
const Article = require('../models/article-model');
const { getPagination, handleSuccess, handleError } = require('../utils/handle');

router
    .get('/', async (ctx, next) => {
        const { keyword, categories, tags, state, currentPage = 1, perPage = 10 } = ctx.query;

        const options = {
            populate: 'categories',
            sort: { _id: -1 },
            page: Number(currentPage),
            limit: Number(perPage)
        };

        const query = {};

        if (keyword) {
            const keywordReg = new RegExp(keyword);
            query['$or'] = [
                { title: keywordReg },
                { description: keywordReg },
                { content: keywordReg }
            ];
        }

        if (tags) {
            query.tags = {
                $in: tags.split(',')
            };
        };

        if (categories) {
            query.categories = {
                $in: categories.split(',')
            }
        };

        if (['0', '1', '2'].includes(state)) {
            query.state = state;
        };

        await Article.paginate(query, options)
            .then((articles) => {
                handleSuccess({ ctx, result: getPagination(articles, options.page, options.limit), message: '文章列表获取成功' });
            })
            .catch((err) => {
                handleError({ ctx, err, message: '文章列表获取失败' });
            });
    }).get('/:id', async (ctx, next) => {
        await Article.findById(ctx.params.id).then((data) => {
            const result = data.toObject();
            handleSuccess({ ctx, result, message: '文章获取成功' });
        });
    }).post('/', async (ctx, next) => {
        const article = ctx.request.body;
        await Article(article).save()
            .then((result) => {
                handleSuccess({ ctx, result, message: '文章新增成功' });
            })
            .catch(error => handleError({ ctx, error, message: '文章新增失败' }));
    }).put('/:id', async (ctx, next) => {
        const article = ctx.request.body;
        await Article.findByIdAndUpdate(ctx.params.id, article, { new: true })
            .then((result) => {
                handleSuccess({ ctx, result, message: '文章修改成功' });
            })
            .catch(error => handleError({ ctx, error, message: '文章修改失败' }));
    }).delete('/:id', async (ctx, next) => {
        await Article.findByIdAndRemove(ctx.params.id)
            .then((result) => {
                handleSuccess({ ctx, result, message: '文章删除成功' });
            })
            .catch(error => handleError({ ctx, error, message: '文章删除失败' }));
    });

module.exports = router;