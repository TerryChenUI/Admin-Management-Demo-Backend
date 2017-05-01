// exports.handleRequest = ({ ctx, res, controller }) => {
//     const method = req.method;
//     const support = !!controller[method];
//     support && controller[method](req, res);
//     support || res.status(405).jsonp({ code: 0, message: '不支持该请求类型！' });
// };

exports.handlePagination = (data, page, limit) => {
    return {
        pagination: {
            currentPage: page,
            perPage: limit,
            total: data.total,
            totalPage: data.pages
        },
        data: data.docs
    }
};

exports.handleSuccess = ({ ctx, result = null, message = '请求成功' }) => {
    ctx.body = { code: 200, result, message };
};

exports.handleError = ({ ctx, error = null, message = '请求失败' }) => {
    ctx.body = { code: 500, message, error };
};