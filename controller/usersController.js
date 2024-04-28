const messagesSchema = require("../Model/messagesSchema");
const { SellerProducts } = require("../Model/productSchema");
const { Usersignup } = require("../Model/userSchema");

exports.signup = async (req, res) => {
  try {
    let { email, password } = req.body.sData;
    let { userType } = req.params;
    let data = new Usersignup({ email, password, userType });
    await data.save();
    res.json({ success: true, message: "Data inserted", data });
    // console.log("data", email, password);
  } catch (error) {
    if (error.errorResponse.keyPattern.email === 1) {
      // console.log("error while signup",error)
      res.json({ success: false, message: "Duplicate email" });
    }
  }
};

exports.createProduct = async (req, res) => {
  try {
    let { userid } = req.params;
    let { title, description, category, price } = req.body;
    let { filename } = req.file;
    let data = new SellerProducts({
      title,
      description,
      productimg: filename,
      category,
      price,
      userInfo: userid,
    });
    await data.save();
    // find user by id and update the Products ref array
    // const user = await Usersignup.findById(userid);
    // Update the user's gig field with the gig ID
    await Usersignup.updateOne(
      { _id: userid },
      { $push: { products: data._id } }
    );

    res.json({ success: true, message: "Data inserted" });
  } catch (error) {
    console.log("error while createProduct", error);
    res.json({ success: false });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let { userid } = req.params;
    const SellerProducts = await Usersignup.findById(userid).populate({
      path: "products",
    });
    res.json({ success: true, message: "Data inserted", data: SellerProducts });
  } catch (error) {
    console.log("error while", error);
    res.json({ success: false });
  }
};

exports.userProfileUpdate = async (req, res) => {
  try {
    let { userid } = req.params;
    let { filename } = req.file;
    let updatedData = await Usersignup.findByIdAndUpdate(
      { _id: userid },
      { profileImg: filename }
    );
    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.log("error in userProfileUpdate", error);
  }
};

exports.getUserdata = async (req, res) => {
  try {
    let { userid } = req.params;
    let userdata = await Usersignup.findById({ _id: userid });
    res.json({ success: true, data: userdata });
  } catch (error) {
    console.log("error in getUserdata", error);
  }
};

exports.switchAccount = async (req, res) => {
  try {
    let { userid, userType } = req.params;
    let userdata = await Usersignup.findByIdAndUpdate(
      { _id: userid },
      { userType }
    );
    res.json({ success: true, data: userdata });
  } catch (error) {
    console.log("error in switchToBuyer", error);
  }
};

exports.loginAccount = async (req, res) => {
  try {
    let { email, password } = req.body.sData;
    let data = await Usersignup.findOne({ email, password });
    // console.log("data", data);
    if (data) res.json({ success: true, message: "LoggedIn Success", data });
    if (!data) res.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.log("error while loginAccount", error);
    res.json({ success: false, message: "Invalid credentials" });
  }
};

exports.getGigsRandom = async (req, res) => {
  try {
    let data = await SellerProducts.find().populate({ path: "userInfo" });
    // console.log("data", data);
    if (data) res.json({ success: true, message: "Data found", data });
    if (!data) res.json({ success: false, message: "No data found" });
  } catch (error) {
    console.log("error while getGigsRandom", error);
    res.json({ success: false, message: "No data found" });
  }
};

exports.loadParticipants = async (req, res) => {
  try {
    let { buyerid } = req.params;
    let alsoLoggedInUserId = buyerid;
    let data = await Usersignup.find({ _id: alsoLoggedInUserId }).populate({
      path: "messagers",
    });
    // .populate({
    //   path: "messages",
    // })
    // .populate({
    //   path: "rooms",
    // });
    console.log("loadParticipants", data[0].messagers);
    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false });
    console.log("Error in loadParticipants", error);
  }
};

exports.loadParticipantsChatSingle = async (req, res) => {
  try {
    let { alsoLoggedInUserId, otherUserID } = req.params;

    // db.find({ $or: [{ sender: userA, receiver: userB }, { sender: userB, receiver: userA }]}
    //   .sort({ timestamp: -1 }).skip(offset).limit(limit))

    let message = await messagesSchema.find({
      $or: [
        { senderId: alsoLoggedInUserId, recieverId: otherUserID }, // Messages sent by alsoLoggedInUserId to
        { senderId: otherUserID, recieverId: alsoLoggedInUserId }, // Messages sent by otherUserID to alsoLoggedInUserId
      ],
    });

    res.json({ success: true, messages: message });
  } catch (error) {
    res.json({ success: false });
    console.log("Error in loadParticipants", error);
  }
};
