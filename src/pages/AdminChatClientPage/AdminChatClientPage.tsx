import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import SendIcon from "@mui/icons-material/Send";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { ChatRoomType, Message, RootState } from "../../types";
import { SET_CURRENT_USER_CHAT_ROOM } from "../../store/actions/UserActions";
import { INITIAL_STATE_CHAT_ROOM } from "../../store/reducers/UserReducer";

const socket: Socket = io("http://localhost:3003");

const TYPING_DELAY = 1000;
let typingTimeout: NodeJS.Timeout | null = null;

const AdminChatClientPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomNameError, setRoomNameError] = useState(false);
  const [joinedChat, setJoinedChat] = useState(false);
  const [typingUserName, setTypingUserName] = useState("");
  const [typing, setTyping] = useState(false);

  const dispatch = useDispatch();

  const { currentUser, currentUserChatRoom } = useSelector(
    (state: RootState) => state.user
  );

  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    socket.on("messageRoom", (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("allMessagesRoom", (messages: Message[]) => {
      setMessages(messages);
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
      socket.off("messageRoom");
      socket.off("allMessagesRoom");
      socket.off("joinedRoom");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    if (
      currentUserChatRoom === INITIAL_STATE_CHAT_ROOM ||
      !currentUserChatRoom ||
      !currentUserChatRoom.name
    ) {
      return;
    }

    socket.emit("joinRoom", {
      userId: currentUser.id,
      roomName: currentUserChatRoom.name,
      userSocketId: socket.id,
    });

    socket.emit("findAllMessagesByRoomName", {
      roomName: currentUserChatRoom.name,
    });

    setRoomName(currentUserChatRoom.name);
    setJoinedChat(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!currentUser || !currentUserChatRoom || !messageInput.trim()) {
      return;
    }

    socket.emit("messageRoom", {
      userId: currentUser.id,
      userName: currentUser.firstName,
      text: messageInput,
      roomId: currentUserChatRoom.id,
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

  const handleJoinChat = () => {
    if (!roomName.trim()) {
      setRoomNameError(true);
      return;
    }

    setJoinedChat(true);

    socket.emit("joinRoom", {
      userId: currentUser.id,
      roomName: roomName,
      userSocketId: socket.id,
    });

    socket.emit("findAllMessagesByRoomName", {
      roomName: roomName,
    });
  };

  const handleChangeRoomName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRoomName(event.target.value);
    roomNameError && setRoomNameError(false);
  };

  const handleLeaveChat = () => {
    if (!currentUser || !currentUserChatRoom) {
      return;
    }

    setJoinedChat(false);

    socket.emit("leaveRoom", {
      userId: currentUser.id,
      roomName: currentUserChatRoom.name,
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
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: "16px",
      }}
    >
      {joinedChat ? (
        <>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
              }}
            >
              <Typography variant="h5">
                Admin Chat Room: [{roomName}]
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLeaveChat}
                size={"small"}
              >
                Leave Chat
              </Button>
            </div>
            <List
              sx={{
                padding: "16px",
                overflow: "auto",
                height: "95%",
              }}
            >
              {messages.map((message) => (
                <div key={message.id}>
                  <ListItem sx={{ marginBottom: "8px" }}>
                    <Typography
                      sx={{ marginRight: "8px" }}
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
                  <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </div>
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
            sx={{ marginTop: "16px" }}
            onClick={handleSeenMessages}
          />
        </>
      ) : (
        <div
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Join chat with an Admin
          </Typography>
          <TextField
            label="Room Name"
            variant="outlined"
            fullWidth
            value={roomName}
            onChange={handleChangeRoomName}
            sx={{ marginBottom: "16px" }}
            error={roomNameError}
          />
          <Button variant="contained" color="primary" onClick={handleJoinChat}>
            Join Chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminChatClientPage;
