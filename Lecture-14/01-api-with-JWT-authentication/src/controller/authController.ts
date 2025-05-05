import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const logIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(401).json({ message: 'Username and password are incorrect' });
  }
  if (username === 'admin' && password === '123') {
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    }); // 7 days
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // en javascript-skyddad cookie som endast kan användas vid ett anrop
      secure: false,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // Expires in 7 days
    }); // Cookie-parametrar = 'namn på cookien', data, { inställningar }
    res.json({ message: 'You are logged in' });
  } else {
    res.status(401).json({ message: 'Username and password are incorrect' });
  }
};

export const logOut = (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.json({ message: 'You are logged out' });
};
