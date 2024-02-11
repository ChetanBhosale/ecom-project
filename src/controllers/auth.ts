import { Request, Response, Express } from "express";
import {
  SignUpSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  otpEmailValidaton,
} from "../schemas/auth";
import { prisma } from "../db/db";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { compareSync, hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secreat";
import sendMail from "../services/node-email";
import { MySession } from "..";

export const signup = async (req: Request, res: Response) => {
  const data = SignUpSchema.parse(req.body);
  const { email, password, otp } = data;

  let User = await prisma.user.findFirst({ where: { email: req.body.email } });

  if (User) {
    throw new BadRequestException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXITS
    );
  }

  const storedOtps = (req.session as MySession).otps || [];

  const matchedOtp = storedOtps.find((storedOtp) => {
    return (
      email === storedOtp.email &&
      otp === storedOtp.value &&
      Date.now() <= storedOtp.expiresAt
    );
  });

  if (!matchedOtp) {
    throw new BadRequestException(
      "Otp is incorrect!",
      ErrorCode.OTP_IS_INCORRECT
    );
  }

  User = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
    } as any,
  });

  res.status(201).json({
    success: true,
    data: User,
    message: "signed up successfully!",
  });
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = otpEmailValidaton.parse(req.body);

  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    throw new BadRequestException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXITS
    );
  }

  let randomNumber: number = 0;
  while (randomNumber <= 99999) {
    randomNumber = Math.floor(100000 + Math.random() * 900000);
  }

  console.log(randomNumber);

  const newOtp = {
    email,
    value: randomNumber.toString(),
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  (req.session as MySession).otps = (req.session as MySession).otps || [];
  (req.session as MySession).otps.push(newOtp);

  await sendMail(email, "Sent Otp", randomNumber.toString() + "is the otp!");

  res.status(201).json({
    success: true,
    message: "otp sent successfully!",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new BadRequestException("User not found!", ErrorCode.USER_NOT_FOUND);
  } else {
    const checkPass = compareSync(password, user.password);

    if (!checkPass) {
      throw new BadRequestException(
        "Password doest match",
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    const options = {
      id: user?.id,
      role: user?.role,
    };

    const token = jwt.sign(options, JWT_SECRET!);

    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      })
      .status(201)
      .json({
        success: true,
        data: user,
        token: token,
        message: "logged in!",
      });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword, otp } = changePasswordSchema.parse(
    req.body
  );

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new BadRequestException("User not found!", ErrorCode.USER_NOT_FOUND);
  } else {
    const storedOtps = (req.session as MySession).otps || [];

    const matchedOtp = storedOtps.find((storedOtp) => {
      return (
        email === storedOtp.email &&
        otp === storedOtp.value &&
        Date.now() <= storedOtp.expiresAt
      );
    });

    if (!matchedOtp) {
      throw new BadRequestException(
        "Otp is incorrect!",
        ErrorCode.OTP_IS_INCORRECT
      );
    }

    const checkPass = compareSync(oldPassword, user.password);

    if (!checkPass) {
      throw new BadRequestException(
        "Password doest match",
        ErrorCode.INCORRECT_PASSWORD
      );
    }

    user.password = newPassword;

    let data = await prisma.user.update({
      where: { email },
      data: {
        ...user,
      },
    });

    res.status(201).json({
      success: true,
      data: data,
      message: "user updated successfully!",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = forgotPasswordSchema.parse(req.body);

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new BadRequestException("User not found!", ErrorCode.USER_NOT_FOUND);
  } else {
    const storedOtps = (req.session as MySession).otps || [];

    const matchedOtp = storedOtps.find((storedOtp) => {
      return (
        email === storedOtp.email &&
        otp === storedOtp.value &&
        Date.now() <= storedOtp.expiresAt
      );
    });

    if (!matchedOtp) {
      throw new BadRequestException(
        "Otp is incorrect!",
        ErrorCode.OTP_IS_INCORRECT
      );
    }

    user.password = newPassword;

    let data = await prisma.user.update({
      where: { email },
      data: {
        ...user,
      },
    });

    res.status(201).json({
      success: true,
      data: data,
      message: "user updated successfully!",
    });
  }
};
