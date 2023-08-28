const Author = require("../model/author.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { comparePassword, hashPassword } = require("../helper/becrypt");
const { signToken } = require("../helper/token");

const signUp = async (req, res) => {
  const { fullName, email, password, gender } = req.body;
  try {
    if (!fullName || !email || !password || !gender) {
      res.status(404).json({
        message: "all field Required!",
      });
    } else {
      const userExits = await Author.findOne({ email: req.body.email });
      if (userExits) {
        return res.status(400).json({
          message: "you are allready registerd",
        });
      }
      const hasedPassword = await hashPassword(password, 10);
      const author = await Author.create({
        fullName: fullName,
        email:email,
        password: hasedPassword,
        gender: gender,
      });
      res.status(200).json({
        data: author,
        message: "Author Registerd !",
      });
    }
  } catch (error) {}
};

const singIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "please fill all fields",
      });
    } else {
      const author = await Author.findOne({
        email: req.body.email,
      });
      if (!author) {
        return res.status(400).json({
          message: "you are not Registerd",
        });
      }
      const isMatch = await comparePassword(req.body.password, author.password);
      if (isMatch) {
        var token = signToken(author._id);
        return res.status(200).json({
          message: "login succussfully",
          token: token,
        });
      } else {
        return res.status(400).json({
          message: "some-thing went wrong",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const allUser = async (req, res) => {
  try {
    const users = await Author.find();
    if (users) {
      res.status(200).json({
        data: users,
        message: "user fetch successufully",
      });
    } else {
      res.status(400).json({
        message: "Record not Avaible",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const authors = await Author.findByIdAndDelete({ _id: req.params._id });
    if (!authors) {
      res.status(400).json({
        data: book,
        message: "currently No Book here...",
      });
    } else {
      res.status(200).json({
        message: "Delete Author Succussfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const authors = await Author.findByIdAndUpdate(req.params._id,req.body,{new:true})
    if(authors === null){
      res.status(400).json({
        message:'No Record Found !'
      })
    }else{
      res.status(200).json({
        data:authors,
        message:"Author Update Succussfully"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const singleUser = async(req,res)=>{
  try {     
      const author = await Author.find({_id:req.params._id});
      if(author){
          res.status(200).json({
              data:author,
              message:"fetch single User succussfully"
          })
      }else{
          res.status(400).json({
              message:"no Record Avalible!"
          })
      }
  } catch (error) {
      res.status(500).json({
          message:error.message
      })
  }
}

module.exports = { signUp, singIn, allUser, deleteUser , updateUser , singleUser};
