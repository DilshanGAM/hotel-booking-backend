import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export function postUsers(req, res) {
  const user = req.body;

  
  const password = req.body.password;

  const saltRounds = 10;

  const passwordHash = bcrypt.hashSync(password, saltRounds);

  console.log(passwordHash);

  user.password = passwordHash;

  const newUser = new User(user);
  newUser
    .save()
    .then(() => {
      res.json({
        message: 'User created successfully',
      });
    })
    .catch(() => {
      res.json({
        message: 'User creation failed',
      });
    });
}

export function loginUser(req, res) {
  const credentials = req.body;
  User.findOne({ email: credentials.email }).then((user) => {

    if (user == null) {
      res.status(403).json({
        message: 'User not found',
      });
    } else {
      const isPasswordValid = bcrypt.compareSync(credentials.password, user.password);

      if (!isPasswordValid) {
        res.status(403).json({
          message: 'Incorrect password',
        });
      } else {
        const payload = {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
        };

        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '48h' });

        res.json({
          message: 'User found',
          user: user,
          token: token,
        });
      }
    }
  });
}

export function isAdminValid(req){

  if(req.user == null){
    return false
  }
  if(req.user.type != "admin"){
    return false
  }
  return true;
  
}
export function isCustomerValid(req){

  if(req.user == null){
    return false
  }
  console.log(req.user)
  if(req.user.type != "customer"){
    return false
  }

  return true;
  
}

export function getAllUsers(req,res){
  //validate admin
  if(!isAdminValid(req)){
    res.status(403).json({
      message: "Forbidden"
    })
    return;
  }
  User.find().then((users)=>{
    res.json({
      message: "Users found",
      users: users
    })
  }).catch((err)=>{
    res.json({
      message: "Users not found",
      error: err
    })
  })
}

//change type of user
export function changeUserType(req,res){
  //validate admin
  if(!isAdminValid(req)){
    res.status(403).json({
      message: "Forbidden"
    })
    return;
  }
  const userId = req.params.userId;
  const type = req.body.type;

  User.findOneAndUpdate({_id: userId},{type: type}).then(()=>{
    res.json({
      message: "User type updated"
    })
  }).catch((err)=>{
    res.json({
      message: "User type update failed",
      error: err
    })
  })
}

//disable or enable user
export function disableUser(req,res){
  //validate admin
  if(!isAdminValid(req)){
    res.status(403).json({
      message: "Forbidden"
    })
    return;
  }
  const userId = req.params.userId;
  const disabled = req.body.disabled;

  User.findOneAndUpdate({_id: userId},{disabled: disabled}).then(()=>{
    res.json({
      message: "User disabled/enabled"
    })
  }).catch((err)=>{
    res.json({
      message: "User disable/enable failed",
      error: err
    })
  })
}

export function getUser(req,res){
  const user = req.user;
  console.log(user)
  if(user == null){
    res.json({
      message: "not found"
    })
  }else{
    res.json({
      message: "found",
      user : user
    })
  }
}

export function delelteUserByEmail(req,res){
  //validate admin
  if(!isAdminValid(req)){
    res.status(403).json({
      message: "Forbidden"
    })
    return;
  }
  const email = req.params.email;

  User.findOneAndDelete({email: email}).then(()=>{
    res.json({
      message: "User deleted"
    })
  }).catch((err)=>{
    res.json({
      message: "User delete failed",
      error: err
    })
  })
}



const email = "kjsdhfkladsf"
const password = "kljlkslkjlk;kjkl;jsadafklj"
const name = "sdfads"
