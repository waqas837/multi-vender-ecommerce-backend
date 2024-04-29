const mongoose = require("mongoose");

const bookOrder = new mongoose.Schema(
    {
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        deliveryTime: String,
        projectDesc: String,
        Price: Number,
        pojectCompleted: { type: Boolean, default: false },
        acceptedBySeller: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const BookOrder = new mongoose.model("BookOrder", bookOrder);
module.exports = { BookOrder };
