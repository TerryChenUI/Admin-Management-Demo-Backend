const router = require('koa-router')();
const Tag = require('../models/tag');
const { handlePagination, handleSuccess, handleError } = require('../utils/handle');

router.get('/', async (ctx, next) => {
    const { keyword = '', enabled, currentPage = 1, perPage = 10 } = ctx.query;

    const options = {
        sort: { _id: -1 },
        page: Number(currentPage),
        limit: Number(perPage)
    };

    const keywordReg = new RegExp(keyword);
    const query = {
        "$or": [
            { 'name': keywordReg },
            { 'slug': keywordReg },
            { 'description': keywordReg }
        ],
    };

    if (enabled !== undefined) {
        query["$and"] = [
            { 'enabled': enabled === 'true' }
        ]
    }

    await Tag.paginate(query, options)
        .then((tags) => {
            handleSuccess({ ctx, result: handlePagination(tags, options.page, options.limit), message: '标签列表获取成功' });
        })
        .catch((err) => {
            handleError({ ctx, err, message: '标签列表获取失败' });
        })
});

router.get('/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    await Tag.findOne({ id: id }).then((data) => {
        const result = data.toObject();
        handleSuccess({ ctx, result, message: '标签获取成功' });
    });
});

router.post('/', async (ctx, next) => {
    const tag = ctx.request.body;
    await Tag(tag).save()
        .then((result) => {
            handleSuccess({ ctx, result, message: '标签发布成功' });
        })
        .catch(error => handleError({ ctx, error, message: '标签发布失败' }));
});

router.put('/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    const tag = ctx.request.body;
    await Tag.findOneAndUpdate({ id: id }, tag, { new: true })
        .then((result) => {
            handleSuccess({ ctx, result, message: '标签修改成功' });
        })
        .catch(error => handleError({ ctx, error, message: '标签修改失败' }));
});

router.delete('/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    await Tag.findOneAndRemove({ id: id })
        .then((result) => {
            handleSuccess({ ctx, result, message: '标签删除成功' });
        })
        .catch(error => handleError({ ctx, error, message: '标签删除失败' }));
});

module.exports = router;