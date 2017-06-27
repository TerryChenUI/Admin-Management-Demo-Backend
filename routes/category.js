const router = require('koa-router')();
const Category = require('../models/category');
const { getPagination, handleSuccess, handleError } = require('../utils/handle');

router
    .get('/', async (ctx, next) => {
        const { pid, visible, keyword, currentPage = 1, perPage = 10 } = ctx.query;

        const options = {
            sort: { _id: -1 },
            page: Number(currentPage),
            limit: Number(perPage)
        };

        const query = {};

        if (keyword) {
            const keywordReg = new RegExp(keyword);
            query['$or'] = [
                { name: keywordReg },
                { slug: keywordReg },
                { description: keywordReg }
            ];
        }

        if (visible) {
            query.visible = visible === '1';
        }

        if (pid) {
            query.pid = pid;
        }

        await Category.paginate(query, options)
            .then((categories) => {
                handleSuccess({ ctx, result: getPagination(categories, options.page, options.limit), message: '分类列表获取成功' });
            })
            .catch((err) => {
                handleError({ ctx, err, message: '分类列表获取失败' });
            })
    })
    .get('/checkexist', async (ctx, next) => {
        await Category.find(ctx.query)
            .then(({ length }) => {
                length ? handleError({ ctx, message: 'slug已被使用' }) : handleSuccess({ ctx, message: 'slug可使用' });
            })
            .catch((err) => {
                handleError({ ctx, err, message: '检查slug唯一失败' });
            })
    })
    .get('/:id', async (ctx, next) => {
        await Category.findById(ctx.params.id).then((data) => {
            const result = data.toObject();
            handleSuccess({ ctx, result, message: '分类获取成功' });
        });
    })
    .post('/', async (ctx, next) => {
        const category = ctx.request.body;
        await Category(category).save()
            .then((result) => {
                handleSuccess({ ctx, result, message: '分类新增成功' });
            })
            .catch(error => handleError({ ctx, error, message: '分类新增失败' }));
    })
    .put('/:id', async (ctx, next) => {
        const category = ctx.request.body;
        await Category.findByIdAndUpdate(ctx.params.id, category, { new: true })
            .then((result) => {
                handleSuccess({ ctx, result, message: '分类修改成功' });
            })
            .catch(error => handleError({ ctx, error, message: '分类修改失败' }));
    })
    .delete('/:id', async (ctx, next) => {
        await Category.findByIdAndRemove(ctx.params.id)
            .then((result) => {
                handleSuccess({ ctx, result, message: '分类删除成功' });
            })
            .catch(error => handleError({ ctx, error, message: '分类删除失败' }));
    });

module.exports = router;