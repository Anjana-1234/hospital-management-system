import User from "../Module/User.js";
import Doctor from "../Module/Doctor.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const UserRegistrationController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const isExist = await User.findOne({ email });
        if (isExist) {
            res.json({
                success: false,
                code: 400,
                message: "User already exist",
                data: isExist,
                error: true,
            })
        }
        else {
            const { name, email, password, role } = req.body;
            const password1 = await bcrypt.hash(password, 10);
             const data = new User({ name, email, password:password1, role });
            const result = await data.save();
            res.json({ 
                success: true,
                code: 201,
                message: "User registered successfully",
                data: result,
                error: false,
            })
        }
    } catch (err) {
        res.json({
            success: false,
            code: 500,
            message: "Internal Server Error",
            data: err.message,
            error: true,
        })
    }

}
export const UserLoginController = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const data= await User.findOne({email});
        if(data){
            const isExist= await bcrypt.compare(password,data.password);
            if(isExist){
                const { password: _, ...userData } = data.toObject();
                 const Userdata = userData;
                const payload= {email:data.email,role:data.role}
                const token= jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"}) 
                return res.json({
                    success: true,
                    code: 200,
                    message: "User login successfully",
                    data: Userdata,
                    token:token,
                    error: false,
                })
            }
            else{
                res.json({
                    success: false,
                    code: 400,
                    message: "Invalid password are Credentials",
                    data: null,
                    error: true,
                })
            }
        }else{
            res.json({
                success: false,
                code: 400,
                message: "User not found",
                data: null,
                error: true,
            })
        }
       
    }catch(err){
          res.json({
            success: false,
            code: 500,
            message: "Internal Server Error",
            data: err.message,
            error: true,
        })
    }
}

export const addDoctorController = async (req, res) => {
  try {
     const { name, email, password, specialization, qualifications, 
            experience, consultationFee, availableDays, availableTime } = req.body

    // Pehle check karo — email already exist toh nahi karta
    const isExist = await User.findOne({ email })
    if (isExist) {
      return res.json({
        success: false,
        code: 400,
        message: "Email already exist",
        data: null,
        error: true,
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
     const user = new User({ name, email, password: hashedPassword, role: "doctor" })
    const savedUser = await user.save()



    // Doctor profile banao
    const doctor = new Doctor({
      userId: savedUser._id,
      specialization,
      qualifications,
      experience,
      consultationFee,
      availableDays,
      availableTime
    })
    const savedDoctor = await doctor.save()

    return res.json({
      success: true,
      code: 201,
      message: "Doctor added successfully",
      data: { user: savedUser, doctor: savedDoctor },
      error: false,
    })


  }catch(err){
        res.json({
            success: false,
            code: 500,
            message: "Internal Server Error",
            data: err.message,
            error: true,
        })
  }
}

export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "-password")
    return res.json({
      success: true,
      code: 200,
      message: "Doctors fetched successfully",
      data: doctors,
      error: false,
    })
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: err.message,
      error: true,
    })
  }
}

export const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("userId", "-password")
    if (!doctor) {
      return res.json({
        success: false,
        code: 404,
        message: "Doctor not found",
        data: null,
        error: true,
      })
    }
    return res.json({
      success: true,
      code: 200,
      message: "Doctor fetched successfully",
      data: doctor,
      error: false,
    })
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: err.message,
      error: true,
    })
  }
}

export const updateDoctorController = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // ← updated data return karega
    ).populate("userId", "-password")

    if (!doctor) {
      return res.json({
        success: false,
        code: 404,
        message: "Doctor not found",
        data: null,
        error: true,
      })
    }

    return res.json({
      success: true,
      code: 200,
      message: "Doctor updated successfully",
      data: doctor,
      error: false,
    })
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: err.message,
      error: true,
    })
  }
}

export const deleteDoctorController = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) {
      return res.json({
        success: false,
        code: 404,
        message: "Doctor not found",
        data: null,
        error: true,
      })
    }

    // Doctor profile delete karo
    await Doctor.findByIdAndDelete(req.params.id)

    // User bhi delete karo
    await User.findByIdAndDelete(doctor.userId)

    return res.json({
      success: true,
      code: 200,
      message: "Doctor deleted successfully",
      data: null,
      error: false,
    })
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: err.message,
      error: true,
    })
  }
}