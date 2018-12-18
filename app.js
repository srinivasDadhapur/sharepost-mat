const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

mongoose.connect('mongodb://127.0.0.1:27017/mongoposts', { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Connected');

})

mongoose.connection.on('error', () => {
    console.log('cannot connect to the mongoose');

})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});


const MongoModel = mongoose.model('user', userSchema);

const jwtSchema = mongoose.Schema({
    token: String,
    username: String,
    user: userSchema
});

const jwtModel = mongoose.model('jwttoken', jwtSchema);

const postSchema = mongoose.Schema(
    {
        title: String,
        post: String,
        comments: [{}],
        userId: String
    }
);

const postsModel = mongoose.model('post', postSchema);


// const exampleschema = new jwtModel({token:'fsdddfsd',user:{name:'sriniJWTTEst',email:'jwtemail@mail.com',password:'somejwtpass'}});
// exampleschema.save(()=>{
//     console.log('added');
// });



// const exampleschema = new MongoModel({name:'SriniDadapp',email:'Sometestingemail@testmail.com',password:'abcd123'});
// exampleschema.save(()=>{
//     console.log('added');
// });


app.post('/jwtaccess', (req, res) => {
    // console.log(req.body.token);
    jwtModel.findOne({ token: req.body.token }, (err, userToken) => {

        if (!userToken) {
            return res.status(403).send({ tokenexists: false });
        }
        res.send({ tokenexists: true, token: userToken.token, name: userToken.user.name, email: userToken.user.email });
    });
})


app.get('/', (req, res) => {
    res.send('Hello there');
});

app.post('/getposts', (req, res) => {
    // console.log(req.body.email);
    postsModel.find({ userId: req.body.userId }, (err, data) => {

        if (data) {
            let sendUser = [];
            data.forEach(element => {
                sendUser.push({ post: element.post.slice(0, 50), title: element.title, _id: element._id });
            });
            // console.log(sendUser);

            return res.send(sendUser);
        }
        res.send({ error: err })
    })
});

app.post('/deletepost', (req, res) => {
    postsModel.deleteOne({ _id: req.body.id }, (err, data) => {
        if (data.n) {
            res.send({ success: true, msg: "Deleted Successfully" })
        }
        else {
            res.send({ success: false, msg: "Cannot delete, please try again" })
        }
    })
})


app.post('/getpost', (req, res) => {
    // console.log(req.body.email);
    postsModel.findOne({ _id: req.body.id }, (err, data) => {

        if (data) {
            let sendUser = {
                post: data.post,
                user: data.userId,
                title: data.title,
                _id: data._id,
                comments: data.comments
            }
            return res.send(sendUser);
        }
        res.send({ error: err })
    })
});




app.get('/getposts', (req, res) => {
    // console.log(req.body.email);
    postsModel.find({}, (err, data) => {

        if (data) {
            let sendUser = [];
            data.forEach(element => {
                sendUser.push({ post: element.post.slice(0, 50), title: element.title, _id: element._id });
            });
            // console.log(sendUser);

            return res.send(sendUser);
        }
        res.send({ error: err })
    })
});

app.get('/getusers', (req, res) => {
    // console.log(req.body.email);
    MongoModel.find({}, (err, data) => {

        if (data) {
            // console.log(data);

            let userData = []
            data.forEach(element => {
                userData.push({
                    _id: element._id,
                    name: element.name,
                    email: element.email
                })
            });

            return res.send(userData);
        }
        res.send({ error: err })
    })
});


app.post('/post', (req, res) => {
    newPost = new postsModel({ title: req.body.title, post: req.body.post, userId: req.body.userId });
    newPost.save((err, data) => {
        if (err) {
            res.status(403).send({ success: false, msg: 'cannot post your data' });
        }
        else {
            //   console.log(data);
            res.status(200).send({ success: true, msg: 'posted your data successfully' });
        }
    });
});

app.post('/logout', (req, res) => {
    // console.log(req.body.token);
    jwtModel.deleteOne({ token: req.body.token }, (err, data) => {
        if (data.n) {
            res.send({ success: true, msg: 'Logged out successfully' })
        }
        else {
            res.send({ success: false, msg: 'Logged out already' })
        }
    });
})


app.put('/postcomment', (req, res) => {
    // console.log(req.body.post);
    let comment = req.body.comment;
    let user = req.body.user;
    postsModel.update({ _id: req.body.id }, { $push: { comments: { "content": comment, "user": user } } }, (err, data) => {
        if (data.nModified) {
            return res.send({ success: true, msg: "posted your comment successfully" });
        }
        else {
            res.send({ success: false, msg: "cannot post your comment" })
        }
        //     let post;
        //     console.log(req.body.post);
        //     data.posts.forEach(element => {
        //         if(element.post==req.body.post){
        //             console.log(data.posts);
        //             //  data.posts.comments.push({"comment":"success adding comment","user":"admin"});
        //             data.save(error=>{
        //                 return console.log('returned');
        //             });
        //         }
        //     });
        //    return res.send({success:true,msg:"posted the comment successfully!"});
        // }
        // res.send({error:err})
    })
});



app.post('/register', (req, res) => {
    newUser = new MongoModel({ name: req.body.name, email: req.body.email, password: req.body.password });
    addUser(newUser, (err, user) => {
        if (err) {
            res.send({ success: false, msg: err })

        }
        else {
            res.send({ success: true, msg: user });

        }
    });
});

app.post('/authenticate', (req, res) => {
    const query = { email: req.body.email };
    MongoModel.findOne(query, (err, user) => {
        if (!user) {
            return res.status(403).send({ success: false, msg: 'invalid user' });
        }
        comparePassword(req.body.password, user.password, (err, ismatch) => {
            const username = user.email;
            if (ismatch) {
                jwtModel.findOne({ username: username }, (err, jwtuser) => {
                    if (!jwtuser) {
                        const token = jwt.sign({ data: user }, 'my secret key');
                        new jwtModel({ token: token, user: user, username: username }).save((err, token) => {
                            //console.log(token);

                        });
                        res.send({ success: true, token: token, email: username, msg: 'Logged in' });

                    }
                    else {
                        res.send({ success: true, token: jwtuser.token, email: jwtuser.username, msg: 'Already Logged in' });

                    }
                });
                // const token = jwt.sign({data:user},'my secret key');
                // new jwtModel({token:token,user:user}).save((err,token)=>{
                //         console.log(token);

                // });
                //res.send({success:true,token:token,email:user.email, msg:'Logged in'});
                //res.send({msg:"Hi there"});
            } else {
                res.status(403).send({ success: false, msg: 'invalid password' });
            }
        });

    });
})

function comparePassword(userPass, password, callback) {
    bcrypt.compare(userPass, password, function (err, resp) {
        if (err) console.log(err);
        else {
            callback(null, resp);
        }

    });
}


function addUser(addUser, callback) {
    bcrypt.hash(addUser.password, 10, (err, hash) => {
        addUser.password = hash;
        addUser.save(callback);

    });
}



app.listen(8080, () => {
    console.log('listening on 8080');
})
