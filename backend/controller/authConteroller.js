// import express from "express";
// import bcrypt from "bcrypt";
// import User from "../models/user.js";
// import JWT from "jsonwebtoken";

// const registerController = async (req, res) => {
//   try {
//     const { name, email, password, phone, address, answer } = req.body;
//     // console.log({
//     //   name,
//     //   email,
//     //   password,
//     //   phone,
//     //   answer,
//     //   address,
//     // });

//     if (!name || !email || !password || !phone || !address || !answer) {
//       return res.status(501).send({ message: "field is required " });
//     }

//     const saltRound = 10;
//     const hashPassword = await bcrypt.hash(password, saltRound);

//     // if user already exist redirect to login page
//     const userExist = await User.find({ email: email });
//     if (userExist.length) {
//       return res.status(200).send({
//         success: false,
//         message: "Alraedy register",
//       });
//     }
//     // console.log(hashPassword);
//     const user = await new User({
//       name: name,
//       email: email,
//       password: hashPassword,
//       phone: phone,
//       address: address,
//       qustion: answer,
//     });
//     await user.save();

//     res.status(200).send({
//       success: true,
//       message: "User Register Sucessfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error,
//     });
//   }
// };

// const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(404).send({
//         success: false,
//         message: "Invalid details",
//       });
//     }
    
//     const user = await User.findOne({ email: email });
    
//     if (!user.password) {
//       return res.status(404).send({
//         success: false,
//         message: "Invalid details",
//       });
//     }
//     const match = await bcrypt.compare(password, user.password);
//     // console.log(match);
//     if (!match) {
//       return res.status(404).send({
//         success: false,
//         message: "Invalid details",
//       });
//     }

//     // token
//     const token = await JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
//       expiresIn: "30d",
//     });
//     res.status(200).send({
//       success: true,
//       message: "login successfully",
//       user: {
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         role:user.role
//       },
//       token: token,
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error,
//     });
//   }
// };

// // forgot password
// const forgotPassword = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const answer = req.body.answer;
//     const newPassword = req.body.newPassword;

//     if (!email || !answer || !newPassword) {
//       return res.status(400).send({
//         success: false,
//         message: "Field is required",
//       });
//     }
//     const user = await User.findOne({ email: email, qustion: answer });
//     if (!user) {
//       res.status(401).send({
//         success: false,
//         message: "Invalid details",
//       });
//     }

//     const saltRound = 10;
//     const hashPassword = await bcrypt.hash(newPassword, saltRound);
//     await User.findByIdAndUpdate(user._id, { password: hashPassword });

//     res.status(200).send({
//       success: true,
//       message: "Password update successfully",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error,
//     });
//   }
// };

// const testController = (req, res) => {
//   res.send({
//     message: "working",
//   });
// };

// export { registerController, loginController, testController, forgotPassword };
