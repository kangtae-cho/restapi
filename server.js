const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config({path:'variables.env'});
// env file 잘 물렸는지 확인
console.log(process.env.MONGODB_URL);

const server = express();

server.get('/',(req,res) => {
    const newUser = new User();
    newUser.email = "awd@sdfdf.com";
    newUser.name ="kt";
    newUser.age ='26';
    newUser.save()
        .then((user) => {
            console.log(user);
            res.json({
                message:'User Created Succesfully'
            });
        })
        .catch((err)=>{
            res.json({
            message:'user was not created successfully'
            });
        });

    });

server.use(bodyParser.json());
// // server 가 모든 request 의 json format 의 파일을 읽을 수 있게됨
const users = [ 
    {
        id:"abcd",
        name:"danny",
        email:"kt.cho@naver.com"
    },
    {
        id:"efg",
        name:"jenny",
        email:"aa@nn.com"
    }
];

server.get("/api/user", (req,res) => {
    res.json(users); // stringify 해야하는 것 아닌가?
});

// read
server.get("/api/user/:id",(req,res) => {
    console.log(req.params.id);
    //find: users 의 element 하나하나를 확인해서 조건에 부합하는 element 중 가장 먼저 
    //조건에 부합하는 element를 return
    const user = users.find((u)=>{
        return u.id === req.params.id;
    });
    if (user) {
        res.json(user);
    }else{
        res.status(404).json({ errorMessage:"user was not foumnd"});
    } 
});

// add
server.post("/api/user", (req,res) => {
    console.log(req.body);
    users.push(req.body); // body 가 하나의 object 이기 떄문에 바로추가 
    res.json(users);
});

//update
server.put('/api/user/:id',(req,res) => {
    let foundIndex = users.findIndex(u=>u.id === req.params.id);
    // 없으면 -1 return
    if (foundIndex === -1) {
        res.status(404).json({erorMessage: 'User was not found'});
    }else{
        users[foundIndex] = {...users[foundIndex], ...req.body};
        res.json(users[foundIndex]);
    };
});

// delete
server.delete('/api/user/:id', (req,res) => {
    let foundIndex = users.findIndex(u=>u.id === req.params.id);
    if(foundIndex === -1) {
        res.status(404).json({errorMessage: "User was not found"});
    }else{
        //splice: foundIndex부터 1개의 element 를 잘라내고 잘라내진 element들을 return
        let foundUser = users.splice(foundIndex,1);
        res.json(foundUser[0]);
    };
});

server.listen(3000, "0.0.0.0", (err)=> {
    if(err) {
        return console.log(err);
    } else {
        mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true}, (err) => {
            if (err) {
                console.log(err);
            } else{
                console.log("Connected to db succuessfuly");
            }   
        });
    }
});


// server.listen(3000, (err)=> {
//     if(err) {
//         return console.log(err);
//     } else{
//         mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true}, (err) => {
//             if (err) {
//                 console.log(err);
//             } else{
//                 console.log("Connected to db succuessfuly");
//             }   
//     });
//     }
// });




