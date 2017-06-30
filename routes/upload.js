const router = require('koa-router')();
const os = require('os');
const fs = require('fs');
const path = require('path');
const { handleSuccess, handleError } = require('../utils/handle');

router
  .post('/articlethumb', async (ctx, next) => {
    try {
      const file = ctx.request.body.files.file;
      const reader = fs.createReadStream(file.path);
      const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
      reader.pipe(stream);
      console.log('uploading %s -> %s', file.name, stream.path);
      const result = {
        uid: '123',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: file.name,   // 文件名
        status: 'done',  // 状态有：uploading done error removed
        response: '{"status": "success"}',  // 服务端响应内容
      };
      handleSuccess({ ctx, result, message: '上传成功' });
    }
    catch (response) {
      const error = {
        status: 'error',
        response: '{"status": "fail"}',  // 服务端响应内容
      };
      handleError({ ctx, error, message: '上传失败' })
    }
  })
// .post('/articlecontent', async (ctx, next) => {
//   const tag = ctx.request.body;
//   await Tag(tag).save()
//     .then((result) => {
//       handleSuccess({ ctx, result, message: '标签新增成功' });
//     })
//     .catch(error => handleError({ ctx, error, message: '标签新增失败' }));
// })

module.exports = router;