const express = require("express");
const router = express.Router();
const upload = require("../middleware/Imageupload");
const {
  signup,
  createProduct,
  getProducts,
  userProfileUpdate,
  getUserdata,
  switchAccount,
  loginAccount,
  getGigsRandom,
  loadParticipants,
  loadParticipantsChatSingle,
} = require("../controller/usersController");
router.post("/signup/:userType", signup);
router.post("/login", loginAccount);
router.post("/switchAccount/:userid/:userType", switchAccount);
router.get("/getUserData/:userid", getUserdata);
router.post("/createProduct/:userid", upload.single("file"), createProduct);
router.get("/getAllProducts/:userid", getProducts);
router.get("/getGigsRandom", getGigsRandom);
router.patch(
  "/userProfileImage/:userid",
  upload.single("file"),
  userProfileUpdate
);
// messages routes
router.get("/loadParticipants/:buyerid", loadParticipants);
router.get("/loadParticipantsChat/:alsoLoggedInUserId/:otherUserID", loadParticipantsChatSingle);

module.exports = router;
