import nodemailer from 'nodemailer';
import { redis } from '../app.js';
import { User } from '../models/auth.model.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      const isExists = await User.findOne({ email});
      if (isExists && isExists.isActive === true) {
        return res.status(409).json({ message: 'Email was already used'});
      }
       
      const code = Math.ceil(Math.random() * 1000000);
      redis.set(email, code, 'EX', 120);
      
      const transporter = nodemailer.createTransport({
          port: 465,
          host: 'smtp.gmail.com',
          auth: {
              user: "nasirullayevo7@gmail.com",
              pass: "smenmggcgonbqmwl",
            },
            secure: true,
        });
        
        const mailData = {
            from: "nasirullayevo7@gmail.com",
            to: email,
            subject: 'Registration',
            text: 'Verification',
            html: `<b>Your code:</b><br>${code}<br/>`,
        };
        await transporter.sendMail(mailData);

      if(!isExists) {
      let hashPass = await bcrypt.hash(password, 10);
      const newUser = await User.create({ firstName, lastName, email, hashPass });
      return res.status(201).json({ message: 'Successfully registered. Please confirm it via email', newUser});
      } else {
        res.status(200).json({message: 'Code was sent again. Please confirm your email'});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
export const registerVerification = async (req, res) => {
    const {email, code} = req.body;
    console.log(email);
    const isValid = await redis.get(email);
    console.log(isValid);
    if (isValid != code) return res.status(409).json({message: 'Invalid code or email'});

    await User.findOneAndUpdate({email: email}, {isActive: true});
    return res.status(201).json({ message: 'Successfully confirmed'});
}  
  
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        console.log(findUser);
        if(!findUser){
            return res.status(404).json({ message: 'Invalid email or password' });
        };
        if(!findUser.isActive) return res.status(400).json({message:'You have not verified your email'});
        const isPass = await bcrypt.compare(password, findUser.hashPass);

        if(!isPass) return res.status(400).json({message: 'Invalid email or password'});
        return res.status(200).json({ message: 'Successfully logged in'});

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  };
  