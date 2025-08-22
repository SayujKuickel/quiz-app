function verifyUserController(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    return res.status(200).json({
      message: "User is authenticated",
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = { verifyUserController };
