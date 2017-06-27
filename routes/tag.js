const router = require('koa-router')();
const Tag = require('../models/tag');
const { getPagination, handleSuccess, handleError } = require('../utils/handle');

router
    .get('/', async (ctx, next) => {
        const { keyword, visible, currentPage = 1, perPage = 10 } = ctx.query;

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
            query.visible = visible === "1";
        }

        await Tag.paginate(query, options)
            .then((tags) => {
                handleSuccess({ ctx, result: getPagination(tags, options.page, options.limit), message: '标签列表获取成功' });
            })
            .catch((err) => {
                handleError({ ctx, err, message: '标签列表获取失败' });
            })
    })
    .get('/checkexist', async (ctx, next) => {
        await Tag.find(ctx.query)
            .then(({ length }) => {
                length ? handleError({ ctx, message: 'slug已被使用' }) : handleSuccess({ ctx, message: 'slug可使用' });
            })
            .catch((err) => {
                handleError({ ctx, err, message: '检查slug唯一失败' });
            })
    })
    .get('/:id', async (ctx, next) => {
        await Tag.findById(ctx.params.id).then((data) => {
            const result = data.toObject();
            handleSuccess({ ctx, result, message: '标签获取成功' });
        });
    })
    .post('/', async (ctx, next) => {
        const tag = ctx.request.body;
        await Tag(tag).save()
            .then((result) => {
                handleSuccess({ ctx, result, message: '标签新增成功' });
            })
            .catch(error => handleError({ ctx, error, message: '标签新增失败' }));
    })
    .put('/:id', async (ctx, next) => {
        const tag = ctx.request.body;
        await Tag.findByIdAndUpdate(ctx.params.id, tag, { new: true })
            .then((result) => {
                handleSuccess({ ctx, result, message: '标签修改成功' });
            })
            .catch(error => handleError({ ctx, error, message: '标签修改失败' }));
    })
    .delete('/:id', async (ctx, next) => {
        await Tag.findByIdAndRemove(ctx.params.id)
            .then((result) => {
                handleSuccess({ ctx, result, message: '标签删除成功' });
            })
            .catch(error => handleError({ ctx, error, message: '标签删除失败' }));
    });

module.exports = router;