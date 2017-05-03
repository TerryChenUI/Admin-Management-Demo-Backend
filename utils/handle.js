exports.getPagination = (data, page, limit) => {
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
    ctx.body = { result, message, code: 1 };
};

exports.handleError = ({ ctx, error = null, message = '请求失败' }) => {
    ctx.body = { message, error, code: 0 };
};