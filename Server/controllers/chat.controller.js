import { Chat, Message } from "../models/chat.model.js"
import Adoption from "../models/adoption.model.js"
import Pet from "../models/pet.model.js"

// ... (createChatForAdoption, getUserChats, getChatMessages, sendMessage functions are unchanged) ...
export const createChatForAdoption = async (adoptionId) => {
  try {
    console.log("Creating chat for adoption:", adoptionId)

    // Check if chat already exists
    const existingChat = await Chat.findOne({ adoptionId })
    if (existingChat) {
      console.log("Chat already exists for adoption:", adoptionId)
      return existingChat
    }

    // Get adoption details with pet info
    const adoption = await Adoption.findById(adoptionId).populate("petId")

    if (!adoption || !adoption.petId) {
      throw new Error("Adoption or pet not found")
    }

    const pet = adoption.petId
    console.log("Pet found:", pet.name)
    console.log("Pet owner data:", pet.owner)

    // Extract owner information from the embedded owner object
    const ownerEmail = pet.owner?.email
    const ownerName = pet.owner?.fullName

    if (!ownerEmail || !ownerName) {
      console.error("Missing owner information in pet:", pet._id)
      console.error("Pet owner object:", pet.owner)
      throw new Error("Pet owner information is incomplete")
    }

    console.log("Using owner info:", { ownerEmail, ownerName })

    // Create new chat
    const newChat = new Chat({
      adoptionId,
      petId: pet._id,
      buyer: {
        email: adoption.email,
        name: adoption.fullName,
      },
      seller: {
        email: ownerEmail,
        name: ownerName,
      },
    })

    await newChat.save()
    console.log("Chat created successfully:", newChat._id)

    // Send initial system message
    const initialMessage = new Message({
      chatId: newChat._id,
      sender: "buyer",
      senderEmail: "system@petadoption.com",
      senderName: "System",
      content: `Chat created for ${pet.name}. You can now communicate with each other about the adoption process.`,
    })

    await initialMessage.save()

    // Update chat with last message
    newChat.lastMessage = {
      content: initialMessage.content,
      sender: "system",
      timestamp: initialMessage.timestamp,
    }
    await newChat.save()

    console.log("Initial message sent for chat:", newChat._id)
    return newChat
  } catch (error) {
    console.error("Error creating chat:", error)
    throw error
  }
}


export const getUserChats = async (req, res) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    console.log("Fetching chats for user:", email)

    const chats = await Chat.find({
      $or: [{ "buyer.email": email }, { "seller.email": email }],
    })
      .populate("petId")
      .populate("adoptionId")
      .sort({ "lastMessage.timestamp": -1 })

    console.log("Found chats:", chats.length)

    // Get unread message count for each chat
    const chatsWithUnreadCount = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          read: false,
          senderEmail: { $ne: email },
        })

        return {
          ...chat.toObject(),
          unreadCount,
          userRole: chat.buyer.email === email ? "buyer" : "seller",
        }
      }),
    )

    res.status(200).json(chatsWithUnreadCount)
  } catch (error) {
    console.error("Error in getUserChats:", error)
    res.status(500).json({ message: "Error fetching chats", error: error.message })
  }
}


export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params
    const { page = 1, limit = 50 } = req.query
    const skip = (page - 1) * limit

    console.log("Fetching messages for chat:", chatId)

    // Verify chat exists
    const chat = await Chat.findById(chatId).populate("petId")
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Get messages with pagination (newest first)
    const messages = await Message.find({ chatId }).sort({ timestamp: -1 }).skip(skip).limit(Number.parseInt(limit))

    // Reverse to show oldest first in UI
    messages.reverse()

    res.status(200).json({
      messages,
      chat: chat,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        hasMore: messages.length === Number.parseInt(limit),
      },
    })
  } catch (error) {
    console.error("Error in getChatMessages:", error)
    res.status(500).json({ message: "Error fetching messages", error: error.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, senderEmail, senderName } = req.body;
    const io = req.io; 

    if (!chatId || !content || !senderEmail || !senderName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    
    // --- CORRECTED: Refactored and more robust role identification ---
    let senderRole = null;
    if (chat.buyer.email === senderEmail) {
        senderRole = "buyer";
    } else if (chat.seller.email === senderEmail) {
        senderRole = "seller";
    }

    // Security check: if the sender is neither the buyer nor the seller, deny access.
    if (!senderRole) {
      return res.status(403).json({ message: "You don't have access to this chat" });
    }

    const newMessage = new Message({
      chatId,
      sender: senderRole, // Use the explicitly determined role
      senderEmail,
      senderName,
      content: content.trim(),
    });

    await newMessage.save();

    // Update the last message on the chat document
    chat.lastMessage = {
      content: newMessage.content,
      sender: senderRole,
      timestamp: newMessage.timestamp,
    };
    await chat.save();

    // --- CORRECTED: Broadcast a plain object for reliability ---
    // This ensures no Mongoose-specific data is sent over the socket.
    io.to(chatId).emit('receive_message', newMessage.toObject());
    console.log(`Message emitted to room ${chatId}`);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

/**
 * Mark messages as read
 * @route PUT /api/chat/mark-read/:chatId
 */
export const markMessagesAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { userEmail } = req.body;
        const io = req.io; // Get io instance

        if (!userEmail) {
            return res.status(400).json({ message: "User email is required" });
        }

        const result = await Message.updateMany(
            { chatId, senderEmail: { $ne: userEmail }, read: false },
            { $set: { read: true } }
        );

        if (result.modifiedCount > 0) {
            // If any messages were updated, emit an event to the room
            io.to(chatId).emit('messages_read', { 
                chatId, 
                readerEmail: userEmail 
            });
            console.log(`Emitted 'messages_read' to room ${chatId} for user ${userEmail}`);
        }
        
        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error in markMessagesAsRead:", error);
        res.status(500).json({ message: "Error marking messages as read", error: error.message });
    }
};

// ... (getChatByAdoption and debugPetOwnerData functions are unchanged) ...
export const getChatByAdoption = async (req, res) => {
  try {
    const { adoptionId } = req.params
    const { userEmail } = req.query

    console.log("Looking for chat by adoption:", adoptionId, "for user:", userEmail)

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" })
    }

    const chat = await Chat.findOne({ adoptionId }).populate("petId").populate("adoptionId")

    if (!chat) {
      console.log("No chat found for adoption:", adoptionId)

      // Check if the adoption exists and is approved
      const adoption = await Adoption.findById(adoptionId)
      if (!adoption) {
        return res.status(404).json({ message: "Adoption not found" })
      }

      if (adoption.status !== "approved") {
        return res.status(400).json({ message: "Chat is only available for approved adoptions" })
      }

      // If adoption is approved but no chat exists, try to create one
      try {
        console.log("Attempting to create missing chat for approved adoption:", adoptionId)
        const newChat = await createChatForAdoption(adoptionId)

        // Get unread count for the new chat
        const unreadCount = await Message.countDocuments({
          chatId: newChat._id,
          read: false,
          senderEmail: { $ne: userEmail },
        })

        return res.status(200).json({
          ...newChat.toObject(),
          unreadCount,
          userRole: newChat.buyer.email === userEmail ? "buyer" : "seller",
        })
      } catch (createError) {
        console.error("Error creating chat for approved adoption:", createError)
        return res.status(500).json({
          message: "Error creating chat for approved adoption",
          error: createError.message,
        })
      }
    }

    // Verify user has access
    if (chat.buyer.email !== userEmail && chat.seller.email !== userEmail) {
      return res.status(403).json({ message: "You don't have access to this chat" })
    }

    // Get unread count
    const unreadCount = await Message.countDocuments({
      chatId: chat._id,
      read: false,
      senderEmail: { $ne: userEmail },
    })

    console.log("Chat found:", chat._id, "unread count:", unreadCount)

    res.status(200).json({
      ...chat.toObject(),
      unreadCount,
      userRole: chat.buyer.email === userEmail ? "buyer" : "seller",
    })
  } catch (error) {
    console.error("Error in getChatByAdoption:", error)
    res.status(500).json({ message: "Error fetching chat", error: error.message })
  }
}


export const debugPetOwnerData = async (req, res) => {
  try {
    const { petId } = req.params

    const pet = await Pet.findById(petId)

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" })
    }

    res.status(200).json({
      petId: pet._id,
      petName: pet.name,
      ownerData: pet.owner,
      ownerEmail: pet.owner?.email,
      ownerName: pet.owner?.fullName,
      rawPetData: pet.toObject(),
    })
  } catch (error) {
    console.error("Error in debugPetOwnerData:", error)
    res.status(500).json({ message: "Error debugging pet data", error: error.message })
  }
}