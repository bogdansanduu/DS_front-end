import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  InputAdornment,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import SendIcon from "@mui/icons-material/Send";
import ListItem from "@mui/material/ListItem";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { io, Socket } from "socket.io-client";

import { ChatRoomType, Message, RootState } from "../../types";
import { SET_CURRENT_USER_CHAT_ROOM } from "../../store/actions/UserActions";
import { INITIAL_STATE_CHAT_ROOM } from "../../store/reducers/UserReducer";

const socket: Socket = io("http://localhost:3003");

const TYPING_DELAY = 1000;
let typingTimeout: NodeJS.Timeout | null = null;
const AdminChatAdminPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [joinedChat, setJoinedChat] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<ChatRoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomType | null>(null);
  const [typingUserName, setTypingUserName] = useState("");
  const [typing, setTyping] = useState(false);

  const dispatch = useDispatch();

  const { currentUser, currentUserChatRoom } = useSelector(
    (state: RootState) => state.user
  );

  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    socket.emit("getAllRooms");

    socket.on("allRooms", (rooms: ChatRoomType[]) => {
      setAvailableRooms(rooms);
    });

    socket.on("allMessagesRoom", (messages: Message[]) => {
      setMessages(messages);
    });

    socket.on("messageRoom", (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("joinedRoom", (chatRoom: ChatRoomType) => {
      dispatch(SET_CURRENT_USER_CHAT_ROOM(chatRoom));
    });

    socket.on(
      "typing",
      ({ userName, typing }: { userName: string; typing: boolean }) => {
        setTypingUserName(userName);
        setTyping(typing);
      }
    );

    return () => {
      socket.off("allRooms");
      socket.off("allMessagesRoom");
      socket.off("messageRoom");
      socket.off("joinedRoom");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!currentUser || !selectedRoom || !messageInput.trim()) {
      return;
    }

    socket.emit("messageRoom", {
      userId: currentUser.id,
      userName: currentUser.firstName,
      text: messageInput,
      roomId: selectedRoom.id,
    });

    setMessageInput("");
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRoomSelection = (room: ChatRoomType) => {
    socket.emit("joinRoom", {
      userId: currentUser.id,
      roomName: room.name,
      userSocketId: socket.id,
    });
    socket.emit("findAllMessagesByRoomName", {
      roomName: room.name,
    });

    setSelectedRoom(room);
    setJoinedChat(true);
    dispatch(SET_CURRENT_USER_CHAT_ROOM(room));
  };

  const handleLeaveRoom = () => {
    if (!currentUser || !selectedRoom) {
      return;
    }

    setJoinedChat(false);

    socket.emit("leaveRoom", {
      userId: currentUser.id,
      roomName: selectedRoom.name,
      userSocketId: socket.id,
    });

    dispatch(SET_CURRENT_USER_CHAT_ROOM(INITIAL_STATE_CHAT_ROOM));
  };

  const handleOnMessageType = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessageInput(event.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
      socket.emit("typing", {
        roomId: currentUserChatRoom.id,
        userName: currentUser.firstName,
        typing: false,
        socketId: socket.id,
      });
    }, TYPING_DELAY);

    socket.emit("typing", {
      roomId: currentUserChatRoom.id,
      userName: currentUser.firstName,
      typing: true,
      socketId: socket.id,
    });
  };

  const isMessageSeen = (message: Message) => {
    return (
      message.seenBy.length > 0 &&
      message.seenBy.some(({ userId }) => userId !== currentUser.id)
    );
  };

  const handleSeenMessages = () => {
    const otherMessages = messages
      .filter((message) => message.userId !== currentUser.id)
      .map((message) => ({ messageId: message.id, userId: currentUser.id }));

    socket.emit("messagesSeen", {
      messages: otherMessages,
      roomName: currentUserChatRoom.name,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          borderRight: "1px solid #ccc",
          padding: "16px",
        }}
      >
        <Typography variant="h5">Chat Rooms</Typography>
        <List>
          {availableRooms.map((room) => (
            <ListItemButton
              key={room.id}
              selected={selectedRoom?.id === room.id}
              onClick={() => handleRoomSelection(room)}
            >
              {room.name}
            </ListItemButton>
          ))}
        </List>
      </div>
      <div style={{ flex: 5, overflow: "hidden", padding: "16px" }}>
        {joinedChat ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
              }}
            >
              <Typography variant="h5" style={{ marginBottom: "16px" }}>
                Admin Chat Room: {selectedRoom?.name || ""}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLeaveRoom}
                size={"small"}
              >
                Leave Chat
              </Button>
            </div>
            <List
              style={{
                padding: "16px",
                overflow: "auto",
                height: "90%",
              }}
            >
              {messages.map((message) => (
                <div key={message.id}>
                  <ListItem style={{ marginBottom: "8px" }}>
                    <Typography
                      style={{ marginRight: "8px" }}
                      variant="body2"
                      color="textSecondary"
                    >
                      {message.userName}:
                    </Typography>
                    {message.text}
                  </ListItem>
                  <ListItem sx={{ alignItems: "center", gap: "8px" }}>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </Typography>
                    {isMessageSeen(message) && (
                      <DoneAllIcon color={"primary"} />
                    )}
                  </ListItem>
                  <Divider style={{ marginTop: "8px", marginBottom: "8px" }} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </List>
            {typing && (
              <Typography variant="caption" color="textSecondary">
                {typingUserName} is typing...
              </Typography>
            )}
            <TextField
              label="Type your message"
              variant="outlined"
              fullWidth
              value={messageInput}
              onChange={handleOnMessageType}
              onKeyDown={handleKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={sendMessage}
                      startIcon={<SendIcon />}
                    >
                      Send
                    </Button>
                  </InputAdornment>
                ),
              }}
              style={{ marginTop: "16px" }}
              onClick={handleSeenMessages}
            />
          </>
        ) : (
          <div>Select a chat room</div>
        )}
      </div>
    </div>
  );
};

export default AdminChatAdminPage;
