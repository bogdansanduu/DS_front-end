import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  List,
  ListItem,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import SendIcon from "@mui/icons-material/Send";

import { Message, RootState } from "../../types";

const socket: Socket = io("http://localhost:3003");
const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const messagesEndRef = useRef<any>(null);

  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    socket.emit("findAllMessages");

    socket.on("messageGlobal", (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("allMessages", (messages: Message[]) => {
      setMessages(messages);
    });

    return () => {
      socket.off("messageGlobal");
      socket.off("allMessages");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!currentUser || !messageInput.trim()) {
      return;
    }

    socket.emit("messageGlobal", {
      userId: currentUser.id,
      userName: currentUser.firstName,
      text: messageInput,
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Typography variant="h5" style={{ height: "5%", padding: "12px" }}>
          Chat Room
        </Typography>
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
              <ListItem>
                <Typography variant="caption" color="textSecondary">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </ListItem>
              <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </div>
      <TextField
        label="Type your message"
        variant="outlined"
        fullWidth
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
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
      />
    </div>
  );
};

export default ChatPage;
