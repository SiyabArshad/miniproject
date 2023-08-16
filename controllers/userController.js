const User = require("../models/User");
const FriendRequest = require("../models/FreindRequests");
const bcrypt = require("bcrypt");
const ResponseManager = require("../helpers/CustomError");
const jwt = require("jsonwebtoken");
const FreindRequests = require("../models/FreindRequests");

//all users in app
const getallUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(ResponseManager.successResponse(users));
  } catch (error) {
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
};

//send freind request
const sendfriendRequest = async (req, res) => {
  try {
    const { userId: senderId } = req.user; // sender id from token
    const { id: receiverId } = req.body; // receiver id from body
    if (!receiverId) {
      return res
        .status(400)
        .json(ResponseManager.errorResponse("Receiver ID is required", 400));
    }
    if (senderId === receiverId) {
      return res
        .status(200)
        .json(
          ResponseManager.errorResponse(
            "You can't send a friend request to yourself",
            400
          )
        );
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res
        .status(404)
        .json(
          ResponseManager.errorResponse("Sender or receiver not found", 404)
        );
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (!existingRequest) {
      const friendRequest = new FriendRequest({
        sender: senderId,
        receiver: receiverId,
      });

      await friendRequest.save();

      return res
        .status(200)
        .json(
          ResponseManager.successResponse(
            {},
            "Friend request sent successfully"
          )
        );
    }
    return res
      .status(200)
      .json(
        ResponseManager.errorResponse("Friend request already exists", 409)
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
};

//get freind requests of authenticated user

const getfriendRequests = async (req, res) => {
  try {
    const { userId } = req.user;

    const friendRequests = await FriendRequest.find({ receiver: userId })
      .populate("sender", "name email profilePicture")
      .exec();

    return res
      .status(200)
      .json(ResponseManager.successResponse(friendRequests));
  } catch (error) {
    console.error("Error while getting friend requests:", error);
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
};

//accept freind request
const acceptfriendRequest = async (req, res) => {
  try {
    const { userId: acceptorId } = req.user;
    const { id: requestId } = req.body;

    if (!requestId) {
      return res
        .status(400)
        .json(ResponseManager.errorResponse("No Friend request", 400));
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res
        .status(404)
        .json(ResponseManager.errorResponse("Friend request not found", 404));
    }

    if (!friendRequest.receiver.equals(acceptorId)) {
      return res
        .status(403)
        .json(
          ResponseManager.errorResponse(
            "You do not have permission to accept this request",
            403
          )
        );
    }

    const senderUser = await User.findById(friendRequest.sender);
    const receiverUser = await User.findById(friendRequest.receiver);

    if (!senderUser.friends.includes(receiverUser._id)) {
      senderUser.friends.push(receiverUser._id);
      await senderUser.save();
    }

    if (!receiverUser.friends.includes(senderUser._id)) {
      receiverUser.friends.push(senderUser._id);
      await receiverUser.save();
    }

    await FriendRequest.findByIdAndDelete(requestId);
    return res
      .status(200)
      .json(
        ResponseManager.successResponse(
          {},
          "Friend request accepted successfully"
        )
      );
  } catch (error) {
    console.error("Error while accepting friend request:", error);
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
};

//reject freind request
const rejectfriendRequest = async (req, res) => {
  try {
    const { userId: acceptorId } = req.user;
    const { id: requestId } = req.body;

    if (!requestId) {
      return res
        .status(400)
        .json(ResponseManager.errorResponse("NO Friend request", 400));
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res
        .status(404)
        .json(ResponseManager.errorResponse("Friend request not found", 404));
    }

    if (!friendRequest.receiver === acceptorId) {
      return res
        .status(403)
        .json(
          ResponseManager.errorResponse(
            "You do not have permission to accept this request",
            403
          )
        );
    }

    await FreindRequests.findByIdAndDelete(requestId);
    return res
      .status(200)
      .json(ResponseManager.successResponse({}, "Friend request rejected"));
  } catch (error) {
    console.error("Error while accepting friend request:", error);
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
};

//list of freinds
const getfriendList = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId)
      .populate("friends", "name email profilePicture")
      .exec();

    if (!user) {
      return res
        .status(404)
        .json(ResponseManager.errorResponse("User not found", 404));
    }

    return res.status(200).json(ResponseManager.successResponse(user.friends));
  } catch (error) {
    console.error("Error while getting friend list:", error);
    res
      .status(500)
      .json(ResponseManager.errorResponse("Internal server error", 500));
  }
};

module.exports = {
  getallUsers,
  sendfriendRequest,
  getfriendRequests,
  acceptfriendRequest,
  rejectfriendRequest,
  getfriendList,
};
