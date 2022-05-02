// 文件連結
// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#specification

const apiDoc = {
  openapi: '3.0.0',
  info: {
    version: '1.0',
    title: 'mongoose 會員系統',
    description: '測試用會員系統',
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local server',
    },
    {
      url:'https://mongoose-member.herokuapp.com/',
      description: 'heroku server',
    }
  ],
  tags: [{ name: '會員API', description: '會員系統非RESTful API' }],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    // API的路徑
    '/user/login': {
      post: {
        // API分類 一樣的會放在同一個框
        tags: ['會員API'],
        // API簡介
        summary: '登入用',
        requestBody: {
          description: '參數',
          required: true,
          content: {
            // 傳送格式
            'application/json': {
              // 傳送的資料內容  在下面的components/schemas物件定義要什麼
              schema: {
                $ref: '#/components/schemas/loginModel',
              },
            },
          },
        },
        produces: ['application/json'],
        // API回傳內容
        responses: {
          200: {
            description: 'OK',
            // 回傳內容
            content: {
              // 回傳內容格式
              'application/json': {
                // 回傳的資料格式
                schema: {
                  $ref: '#/components/schemas/loginResModel',
                },
              },
            },
          },
          404: {
            description: 'Error: Not Found',
            // 回傳內容
            content: {
              // 回傳內容格式
              'application/json': {
                // 回傳的資料格式
                schema: {
                  // $ref: '#/components/schemas/loginResModel',
                  type: 'object',
                  properties: {
                    status: {
                      type: 'integer',
                      default: 404,
                    },
                    data: {
                      type: 'string',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/user/signup': {
      post: {
        // API分類 一樣的會放在同一個框
        tags: ['會員API'],
        // API簡介
        summary: '註冊用',
        // API要傳給後端的資料
        requestBody: {
          description: '參數',
          required: true,
          content: {
            // 傳送格式
            'application/json': {
              // 傳送的資料內容  在下面的components/schemas物件定義要什麼
              schema: {
                $ref: '#/components/schemas/signupModel',
              },
            },
          },
        },
        produces: ['application/json'],
        // API回傳內容
        responses: {
          200: {
            description: 'OK',
            // 回傳內容
            content: {
              // 回傳內容格式
              'application/json': {
                // 回傳的資料格式
                schema: {
                  $ref: '#/components/schemas/signupResModel',
                },
              },
            },
          },
        },
      },
    },
    '/user/logout': {
      // API呼叫方法
      get: {
        // API分類 一樣的會放在同一個框
        tags: ['會員API'],
        // API簡介
        summary: '登出',
        produces: ['application/json'],
        // API回傳內容
        responses: {
          200: {
            description: 'OK',
            content: {
              // 回傳格式
              'application/json': {
                // 回傳的資料內容  在下面的components/schemas物件定義要什麼
                schema: {
                  $ref: '#/components/schemas/logoutResModel',
                },
              },
            },
          },
        },
      },
    },
    '/user/edit/{id}': {
      // API呼叫方法
      patch: {
        // API分類 一樣的會放在同一個框
        tags: ['會員API'],
        // API簡介
        summary: '編輯會員資料',
        security:{
          Bearer:{}
        },
        // 帶入參數的方式
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '要編輯的資料ID',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'token',
            in: 'header',
            description: 'jwt token',
            schema: {
              type: 'string',
            },
          },
        ],
        // API要傳給後端的資料
        requestBody: {
          description: '參數',
          required: true,
          content: {
            // 回傳格式
            'application/json': {
              // 回傳的資料內容  在下面的components/schemas物件定義要什麼
              schema: {
                $ref: '#/components/schemas/userEditModel',
              },
            },
          },
        },
        produces: ['application/json'],
        // API回傳內容
        responses: {
          200: {
            description: 'OK',
            content: {
              // 回傳格式
              'application/json': {
                // 回傳的資料內容  在下面的components/schemas物件定義要什麼
                schema: {
                  $ref: '#/components/schemas/userEditResModel',
                },
              },
            },
          },
          404:{
            description: 'Error: Not Found',
            // 回傳內容
            content: {
              // 回傳內容格式
              'application/json': {
                // 回傳的資料格式
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'integer',
                      default: 404,
                    },
                    data: {
                      type: 'string',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          }
        },
      },
    },
    '/user/delete/{id}': {
      delete: {
        // API分類 一樣的會放在同一個框
        tags: ['會員API'],
        // API簡介
        summary: '刪除單個會員',
        security:{
          Bearer:{}
        },
        // 帶入參數的方式
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: '要刪除的會員ID',
          },
          {
            name: 'token',
            in: 'header',
            description: 'jwt token',
            schema: {
              type: 'string',
            },
          },
        ],
        produces: ['application/json'],
        // API回傳內容
        responses: {
          200: {
            description: 'OK',
            // 回傳內容
            content: {
              // 回傳內容格式
              'application/json': {
                // 回傳的資料格式
                schema: {
                  $ref: '#/components/schemas/userDelResModel',
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      loginModel: {
        type: 'object',
        // 必填的選項在畫面的資料格式選schema會有紅色*字號
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            default: 'test@gmail.com',
            description: '註冊時的信箱',
          },
          password: {
            type: 'string',
            default: 'test',
            description: '註冊時的密碼',
          },
        },
      },
      loginResModel: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            default: 200,
          },
          data: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
      signupModel: {
        type: 'object',
        // 必填的選項在畫面的資料格式選schema會有紅色*字號
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      signupResModel: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
            default: 200,
          },
          data: {
            type: 'object',
          },
          message: {
            type: 'string',
          },
        },
      },
      logoutResModel: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
          },
          data: {
            type: 'object',
            default: {},
          },
          message: {
            type: 'string',
          },
        },
      },
      userEditModel: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      userEditResModel: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
          },
          data: {
            type: 'object',
          },
          message: {
            type: 'string',
          },
        },
      },
      userDelResModel: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
          },
          data: {
            type: 'object',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      api_key: {
        type: 'apiKey',
        name: 'api_key',
        in: 'header',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        name:'JWT token',
        in:'header',
        bearerFormat: 'JWT',
      },
    },
  },
};

module.exports = apiDoc;
