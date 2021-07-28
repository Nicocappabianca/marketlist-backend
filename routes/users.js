import express from 'express';
import * as uuid from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../models/users.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email: email });

    if (!user) {
      /* Invalid Credentials */
      res.status(200).json({
        Response: false,
        Message: `User not found`
      });
    } else {
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        /* Invalid Credentials */
        res.status(200).json({
          Response: false,
          Message: `Wrong password or user`
        });
      } else {
        /* Create an assign a TOKEN */
        const sessionToken = jwt.sign(
          {
            /* Token Data */
            id: user.id
          },
          process.env.SECRET_TOKEN || '12345'
        );

        res.status(200).json({
          Response: true,
          id: user.id,
          sessionToken
        });
      }
    }
  } catch (err) {
    res.status(200).json({
      Response: false,
      Message: `${err}`
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`email: ${email} \n password: ${password}`);

    /* Check if username/email already exists */
    const emailExists = await Users.findOne({ email: email });

    if (emailExists) {
      res.status(200).json({
        Response: false,
        Message: `Your email is already registered`
      });
    } else {
      /* Generate Unique Token */
      const userId = uuid.v4();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new Users({
        id: userId,
        email: email,
        password: hashedPassword
      });

      const savedUser = await newUser.save();

      /* New User Created */
      res.status(200).json({
        Response: true,
        Message: `User created`
      });
    }
  } catch (error) {
    res.status(200).json({
      Response: false,
      Message: `${error}`
    });
  }
});

export default router;
