const express = require('express');
const router = express.Router();


router.get('',(req,res)=>{
    const locals = {
        title: "TesterOps Home Page",
        description: "My Sample Blog with NodeJS, Express and MongoDB"
    }
    res.render('index',{locals})
});


router.get('/about',(req,res)=>{
    res.render('about')
});


module.exports = router;