const router = require('koa-router')();
const Category = require('../models/category');
const { getPagination, handleSuccess, handleError } = require('../utils/handle');

router.get('/', async (ctx, next) => {
    const { pid, enabled, keyword, currentPage = 1, perPage = 10 } = ctx.query;

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

    if (enabled) {
        query.enabled = enabled === 'true';
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
});

router.get('/:id', async (ctx, next) => {
    await Category.findById(ctx.params.id).then((data) => {
        const result = data.toObject();
        handleSuccess({ ctx, result, message: '分类获取成功' });
    });
});

router.post('/', async (ctx, next) => {
    const category = ctx.request.body;
    await Category(category).save()
        .then((result) => {
            handleSuccess({ ctx, result, message: '分类新增成功' });
        })
        .catch(error => handleError({ ctx, error, message: '分类新增失败' }));
});

router.put('/:id', async (ctx, next) => {
    const category = ctx.request.body;
    await Category.findByIdAndUpdate(ctx.params.id, category, { new: true })
        .then((result) => {
            handleSuccess({ ctx, result, message: '分类修改成功' });
        })
        .catch(error => handleError({ ctx, error, message: '分类修改失败' }));
});

router.delete('/:id', async (ctx, next) => {
    await Category.findByIdAndRemove(ctx.params.id)
        .then((result) => {
            handleSuccess({ ctx, result, message: '分类删除成功' });
        })
        .catch(error => handleError({ ctx, error, message: '分类删除失败' }));
});

module.exports = router;