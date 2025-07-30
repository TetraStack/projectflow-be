import { changepassword, checkUsername, forgetPassword, getUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendVerification, resetPassword, verifyUser } from "@/controllers/auth.controller";
import { isAuth } from "@/middlewares/isAuthenticated";
import { upload } from "@/middlewares/multer";
import { validate } from "@/middlewares/validator";
import { changePasswordSchema, loginSchema, registerUserSchema, resendVerificationSchema, resetPasswordSchema, verifyEmailSchema } from "@/validators/userSchema";
import { Router } from "express";

export const router: Router = Router()

router.get("/", isAuth, getUser)
router.post("/", upload.single("avatar"), validate(registerUserSchema), registerUser)
router.post("/login", validate(loginSchema), loginUser)
router.post("/logout", isAuth, logoutUser)
router.post("/verify", validate(verifyEmailSchema), verifyUser)
router.post("/resend-verification", validate(resendVerificationSchema), resendVerification)
router.post("/reset-password", validate(resetPasswordSchema), resetPassword)
router.post("/refresh-accesstoken", refreshAccessToken)
router.post("/forget-password", validate(resendVerificationSchema), forgetPassword)
router.post("/change-password", isAuth, validate(changePasswordSchema), changepassword)

router.post("/check-username/:username", checkUsername)

