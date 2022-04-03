const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(400).json({
            message: 'Please provide all fields (name, email, and password)',
            name: name,
            email: email,
            password: password,
        })
    }
    
    try {
        //Check if user exists
        const userExists = await UserModel.findOne({email});
        if(userExists){
            res.status(400).json({message: 'User already exists'})
        }

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create the user
        const newUser = await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        if(newUser){
            res.status(201).json({
                message: 'User was successfully created!',
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email
            })
        }else{
            res.status(400).json({message: 'Something went wrong, please try again'})
        }

    } catch (error) {
        res.status(500).json({message: 'Server or Timeout error'})
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const loggedUser = await UserModel.findOne({email});

        //check if the user exists and the password is correct
        if(loggedUser && (await bcrypt.compare(password, loggedUser.password))){
            res.status(200).json({
                message: 'User successfully logged in',
                _id: loggedUser.id,
                name: loggedUser.name,
                email: loggedUser.email
            })
        }
        else{
            res.status(400).json({message: 'User could not be logged in'})
        }

    } catch (error) {
        
    }
}

const getUserData = async (req, res) => {
    res.status(200).json({message: 'User data retrieved'})
}






module.exports = {
    registerUser,
    loginUser,
    getUserData
}