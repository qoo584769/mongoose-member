const express = require('express');
const router = express.Router();

// 如果很多個controller 解構有可能搞錯
const mongooseUserController = require('../controllers/memberController');

router.post('/login', mongooseUserController.mongooseUserLogin);
router.post('/signup', mongooseUserController.mongooseUserCreate);
router.patch('/edit/:id', mongooseUserController.mongooseUserEdit);
router.delete('/delete/:id', mongooseUserController.mongooseUserDelete);
router.get('/logout', mongooseUserController.mongooseUserLogout);
// router.delete('/deleteall', deleteGate);

module.exports = router;
