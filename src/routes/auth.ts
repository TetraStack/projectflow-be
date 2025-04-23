import { changepassword, forgetPassword, getUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendVerification, resetPassword, verifyUser } from "@/controllers/auth";
import { validate } from "@/middlewares/validator";
import { registerUserSchema } from "@/validators/userSchema";
import { Router } from "express";

export const router: Router = Router()

router.get("/", getUser)
router.post("/", validate(registerUserSchema), registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/verify", verifyUser)
router.post("/resend-verification", resendVerification)
router.post("/reset-password", resetPassword)
router.post("/refresh-accesstoken", refreshAccessToken)
router.post("/forget-password", forgetPassword)
router.post("/change-password", changepassword)

