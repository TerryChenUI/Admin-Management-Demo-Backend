const inspect = require('util').inspect;
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { protocol } = require('../config');

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName(fileName) {
  const nameList = fileName.split('.');
  return nameList[nameList.length - 1];
}

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 文件夹名称， path文件存放路径
 * @return {promise}         
 */
function uploadFile(ctx, options) {
  const req = ctx.req;
  const res = ctx.res;
  const busboy = new Busboy({ headers: req.headers });

  const { filePath, urlPath } = options;
  const mkdirResult = mkdirsSync(filePath);
  const host = req.headers.host;

  return new Promise((resolve, reject) => {
    const result = {
      success: false,
      formData: {}
    };

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      const fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
      const savePath = path.join(filePath, fileName);

      file.pipe(fs.createWriteStream(savePath));

      file.on('end', function () {
        result.success = true;
        result.fileName = fileName;
        result.filePath = path.join(urlPath, fileName);
        result.urlPath = `${protocol}://${host}/${urlPath}/${fileName}`;
        result.message = '文件上传成功';
      })
    })

    // 解析表单中其他字段信息
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      // console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
      result.formData[fieldname] = inspect(val);
    });

    busboy.on('finish', function () {
      resolve(result);
    })

    busboy.on('error', function (err) {
      reject(result);
    })

    req.pipe(busboy);
  })

}

/**
 * 删除文件
 * @param {*} filePath 
 */
function deleteFile(filePath) {
  return fs.unlinkSync(filePath);
}

module.exports = {
  uploadFile,
  deleteFile
};