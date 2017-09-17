# Admin-Management-Demo-Backend
环境要求
* Koa 2.0+
* NodeJS 7.5+
* MongoDB 3.0+


## 命令工具
```
# 启动开发模式
npm run dev

# 调试模式，VSCode配置launch，修改program路径指向app.js, 启动调试即可。

# 生产模式 (TODO)
npm start
pm2 start
``` 

## 文件目录
  - 入口文件
    ```
    app.js -> 主程序入口
    启动Koa程序，启动并连接MongoDB数据库，路由分发，引入配置
    ```

  - 配置文件
    ```
    config.js -> 主程序配置
    数据库配置（程序内部），全局使用（程序内部），其他配置（程序内部），基本信息（API输出）
    ```

  - 数据库
    ```
    mongodb.js -> 数据库连接启动
    暴露数据库连接方法，以及包装后的mongoose对象
    ```

  - 路由
    ```
    routes/*.js -> 路由控制集合
    ```

  - 数据模型
    ```
    models/*.js -> 各功能数据模型，映射Mongoose对应的模型方法
    ```

  - 公共解析器
    ```
    utils/handle.js -> 请求处理器
    handleRequest -> API类型识别器
    handleError -> 控制器失败时解析函数
    handleSuccess -> 控制器成功时解析函数
    ```

## 接口概述

  - HTTP状态码
    * 401 权限不足
    * 403 权限不足
    * 404 项目中不存在
    * 405 无此方法
    * 500 服务器挂了
    * 200 正常

  - 数据特征码
    * code:
        * 1 正常
        * 0 异常
    * message:
        一般均会返回
    * debug:
        一般会返回错误发生节点的err
        在code为0的时候必须返回，方便调试
    * result:
        一定会返回，若请求为列表数据，一般返回`{ pagenation: {...}, data: {..} }`
        若请求具体数据，如文章，则包含直接数据如`{ title: '', content: ... }`


## 数据结构
  - 各种 CRUD 重要字段
    * name         - 名称
    * _id          - mongodb生成的id，一般用于后台执行CRUD操作
    * id           - 插件生成的自增数字id，类似mysql中的id，具有唯一性，用于前台获取数据
    * pid          - 父级ID，用于建立数据表关系，与objectId字段映射
    ···

  - 数据组成的三种可能
    * 数据库真实存在数据
    * mongoose支持的virtual虚拟数据
    * 计算数据

## 任务列表
- 基本路由实现
  ```
  Article 文章
  Category 类别
  Auth 身份验证
  Setting 全局设置
  ```

- 密码存储需要使用md5加密机制

- 权限处理
  ```
  utils/auth.js -> 权限处理器
  权限验证方法，抽象出的对象
  首先会校验jwt的合理性，然后核对加密信息，核对时间戳
  ```
  
- seo服务
  ```
  utils/sitemap.js -> 地图生成器
  网站地图xml生成，抽象出的对象
  包含Tag、Article、Category及一些死数据（页面）的集合，生成xml并写入本地
  实际上，在每次访问sitemap-api和有相关CRUD操作的时候都会被执行
  ```

- 百度实时更新服务
  ```
  utils/baidu-push.js -> 自动根据操作通知百度蜘蛛
  分别会在文章、分类、标签、进行CRUD的时候调用此类
  ```

- 垃圾评论校验
  ```
  utils/akismet.js -> 使用akismet过滤spam
  本应该暴露三个方法：校验spam、提交spam、提交ham
  ```

- 邮件服务
  ```
  utils/email.js -> 根据入参发送邮件
  程序启动时会自动校验，校验成功则根据入参发送邮件
  ```
  
- PM2 生产环境部署

## 相关技术点
  - 服务端
    * [Koa](http://koajs.com/)
    * [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) JWT Json Web Token
