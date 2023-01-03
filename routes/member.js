const express =  require('express');

const router =  express.Router();

const {create,list,photo,update,remove} = require('../controllers/member')

router.post('/create',create);
router.get('/members',list);
router.get('/member/photo/:id',photo);
router.put('/member/:id',update);
router.delete('/member/:id',remove);


module.exports = router;
