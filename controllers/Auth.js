const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../templates/passwordUpdate");
require("dotenv").config();

// Signup Controller for Registering USers

exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
		} = req.body;
		// Check if All Details are there or not
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			accountType: "Admin",
			image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName}${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
			approved:false,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};

// Login controller for authenticating users
exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ email });

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}
		if(!user?.approved)
		{
			return res.status(403).json({
				success: false,
				message: `User not approved by Super Admin`,
			})
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "12h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			user.loginTime= Date.now();
			user.tokenExpiryTime= Date.now() + 12*60*60*1000
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};


// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if(oldPassword === newPassword){
			return res.status(400).json({
				success: false,
				message: "New Password cannot be same as Old Password",
			});
		}
		
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				"Social Forum - Password Updated",
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};


exports.getUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id,{password:false});
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const {firstName, lastName} = req.body;
		const userDetails = await User.findById(id);
		const userUpdatedDetails = await User.findByIdAndUpdate(id,{
			firstName: firstName || userDetails?.firstName,
			lastName: lastName || userDetails?.lastName,
		},{new:true});
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data Updated successfully",
			data: userUpdatedDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.find({},{password:false});
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.approveUser = async (req, res) => {
	try {
		const {approve,userId} = req.body;
		if(!userId){
			return res.status(400).json({
				success:false,
				message:"userId is required"
			})
		}
		const userDetails = await User.findByIdAndUpdate({_id:userId},{
			approved:approve,
		},{new: true});

		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


exports.deleteUser = async (req, res) => {
	try{
		const {id}= req.params
		if(!id){
			return res.status(400).json({
				success:false,
				message:"userId is required"
			})
		}
		const getUser = await User.findById(id);
		if(!getUser)
		{
			return res.status(404).json({
				success:false,
				message:"User not registered",
			})
		}
		await User.findByIdAndDelete(id);
		return res.status(200).json({
			success:true,
			message:"User deleted Succesfully",
		})
	}
	catch(error) {
		console.log(error)
		return res.status(500).json({
			success:false,
			message: error.message,
		})
	}
}