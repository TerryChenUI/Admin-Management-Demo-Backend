const router = require('koa-router')();
const path = require('path');
const { handleSuccess, handleError } = require('../utils/handle');
const { uploadFile, deleteFile } = require('../utils/file');

router
  .post('/', async (ctx, next) => {
    // try {
      const uploadPath = path.join(__dirname, '..', 'public/upload');
      const result = await uploadFile(ctx, {
        fileType: 'content',
        path: uploadPath
      });
      const data = {
        link: result.filePath
      }
      handleSuccess({ ctx, result: data, message: '上传成功' });
    // }
    // catch (error) {
    //   ctx.status = 500;
    //   handleError({ ctx, error, message: '上传失败' });
    // }
  })
  .post('/thumb', async (ctx, next) => {
    try {
      const uploadPath = path.join(__dirname, '..', 'public/upload');
      const result = await uploadFile(ctx, {
        fileType: 'thumb',
        path: uploadPath
      });
      handleSuccess({ ctx, result, message: '上传成功' });
    }
    catch (error) {
      ctx.status = 500;
      handleError({ ctx, error, message: '上传失败' });
    }
  })
  .delete('/delete', async (ctx, next) => {
    const filePath = path.join(__dirname, '..', 'public', ctx.request.body.filePath);
    try {
      deleteFile(filePath);
      handleSuccess({ ctx, message: '删除成功' });
    }
    catch (error) {
      ctx.status = 500;
      handleError({ ctx, error, message: '删除失败' });
    }
  });

module.exports = router;