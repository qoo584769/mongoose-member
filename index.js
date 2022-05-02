const express = require('express');
const session = require('express-session');

const MongoStore = require('connect-mongo');

const swaggerUi = require('swagger-ui-express');
const swaggerSetting = require('./config/swagger');

const memberRouter = require('./routers/memberRouter');

require('dotenv').config();

const DBString = process.env.MONGO_DB_CONNECTING_STRING.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

const app = express();
// 解析要放在路由前面才會經過
// bodypaser可以用在這邊全域 也可以放在router裡面
app.use(express.json());
// urlencoded是用來解析非網址列傳入的資料
app.use(express.urlencoded({ extended: true }));
// 預設session設定
app.use(
  session({
    secret: 'userlogin',
    resave: true,
    saveUninitialized: true,
    name: 'guest',
    store:MongoStore.create({mongoUrl:DBString}),
    cookie: {
      maxAge: 20 * 1000,
    },
  })
);


const options = {
  explorer: true
};

// app.use((req,res,next)=>{
//   res.set('Access-Control-Allow-Headers',
//   'Content-Type, Authorization, Content-Length, X-Requested-With')
//   res.set('Access-Control-Allow-Origin', '*')
//   res.set('Access-Control-Allow-Methods', 'PATCH, POST, GET,OPTIONS,DELETE')
//   res.set('Content-Type', 'application/json')
//   next()
// })
app.use('/user', memberRouter);

// swagger文件中介軟體
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSetting,options));

// 判斷網址不存在
app.use((req, res, next) => {
  res.status(404).send('頁面不存在');
});

// 判斷執行不存在的方法
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    if (err.type === 'entity.parse.failed') {
      // JSON parse failed
      return res.status(400).send({ status: 404, message: '非JSON格式' });
    }
    return res.status(500).send('程式出現問題，請稍後再試');
  }
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`伺服器已開啟在 ${port} port`);
});
