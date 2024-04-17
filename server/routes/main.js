const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

/**
 * GET /
 * HOME
 */
router.get('',async (req,res)=>{

    try {

        const locals = {
            title: "TesterOps Home Page",
            description: "My Sample Blog with NodeJS, Express and MongoDB"
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort:{ createdAt: -1}}])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments({});
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <=Math.ceil(count / perPage);



        //const data = await Post.find();
        res.render('index',{
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }
    
});


/**
 * Run this once to populate DB once
 */

// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "Building TesterOps Blog",
//             body: "This is the body text"
//         },
//         {
//             title: "Viewing File Contents In Unix – Log Files",
//             body: "How to view file content in Unix Log Files"
//         },
//         {
//             title: "The Great API CheckList – Things to Consider When Working with API’s",
//             body: "What to check when testing an API"
//         },
//         {
//             title: "Webhook vs Polling vs Websocket vs Pub/Sub",
//             body: "Exploring different medium of data communication"
//         },
//         {
//             title: "Chrome Browser Storage Options – Indexed DB",
//             body: "What is Indexed DB"
//         },
//         {
//             title: "Chrome Browser Storage Options – Session Storage",
//             body: "What is Session Storage"
//         },
//         {
//             title: "Chrome Browser Storage Options – Local Storage.",
//             body: "What is Local Storage"
//         },
//         {
//             title: "SSL Certificate – Run down – What is SSL Certificate and why do we need it",
//             body: "SSL certificate run down"
//         },

//         {
//             title: "What is RAG and why it is important",
//             body: "Definition and work of RAG"
//         },

//         {
//             title: "Define LLM and what it is",
//             body: "Explain what LLMs are and how do they work"
//         },

//         {
//             title: "Break down LLMs",
//             body: "Secure your LLMs"
//         },


//     ])
// }

// insertPostData();


/**
 * For non-pagination
 */
// router.get('',async (req,res)=>{
//     const locals = {
//         title: "TesterOps Home Page",
//         description: "My Sample Blog with NodeJS, Express and MongoDB"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index',{locals, data});
//     } catch (error) {
//         console.log(error);
//     }
    
// });




/**
 * GET /
 * PAGE post: id
 */

router.get('/post/:id',async (req,res)=>{
    

    try {


        let slug = req.params.id;
        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: "My Sample Blog with NodeJS, Express and MongoDB"
        }
        res.render('post',{locals, data});
    } catch (error) {
        console.log(error);
    }
    
});


/**
 * POST /
 * Post - Search Term
 */
router.post('/search',async (req,res)=>{
    
    try {
        const locals = {
            title: "Search",
            description: "My Sample Blog with NodeJS, Express and MongoDB"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");


        const data = await Post.find({
            $or:[
                {title:{ $regex: new RegExp(searchNoSpecialChar,'i')}},
                {body:{ $regex: new RegExp(searchNoSpecialChar,'i')}}
            ]
        });
        res.render("search",{
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
    
});





router.get('/about',(req,res)=>{
    res.render('about')
});


module.exports = router;