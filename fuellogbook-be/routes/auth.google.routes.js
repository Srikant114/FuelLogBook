import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set token as HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only https in prod
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect frontend (without exposing token in URL)
      const redirectTo = `${process.env.FRONTEND_URL.replace(/\/$/, "")}/auth/oauth-success`;
      return res.redirect(redirectTo);
    } catch (err) {
      console.error("OAuth callback error:", err);
      return res.redirect(
        `${process.env.FRONTEND_URL.replace(/\/$/, "")}/auth/oauth-failure`
      );
    }
  }
);

// Failure route
router.get("/google/failure", (req, res) => {
  return res
    .status(401)
    .json({ success: false, message: "Google authentication failed" });
});

export default router;
