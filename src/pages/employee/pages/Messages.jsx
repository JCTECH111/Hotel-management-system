import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate
import {
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import MessageInput from "../components/MessageInput";

const users = [
  { id: 1, name: "Harry Maguire", lastMessage: "You need to improve now", time: "09:12 AM", avatar: "https://th.bing.com/th/id/OIF.ECWuLFDwFmERq2gOWVPBTA?pid=ImgDetMain", status: "Online" },
  { id: 2, name: "JoeCode", lastMessage: "Rashford is typing...", time: "06:25 AM", avatar: "https://th.bing.com/th/id/R.8a36ee09f55c86df3a26f9a54c1f1416?rik=AT3yCGO0oYfYgw&pid=ImgRaw&r=0", status: "Online" },
  { id: 3, name: "Adaeze", lastMessage: "Bos, I need to talk today", time: "03:11 AM", avatar: "https://th.bing.com/th/id/R.ace5a28bee85fb9a792ce55857033e48?rik=KAa0yNkq%2bWsY%2fw&pid=ImgRaw&r=0", status: "Offline" },
];

const messages = {
  1: [
    { user: "Harry Maguire", text: "Hey lads, tough game yesterday. Let’s talk about what went wrong and how we can improve 😊.", time: "08:34 AM" },
    { user: "You", text: "We had good moments but need to be more clinical.", time: "08:35 AM" },
  ],
  2: [
    { user: "Rashford", text: "We need to control the midfield and exploit their defensive weaknesses.", time: "08:34 AM" },
    { user: "You", text: "Agreed. Let’s focus on the next game.", time: "08:35 AM" },
  ],
  3: [
    { user: "You", text: "Hey, I was just thinking about you...", time: "08:34 AM" },
    { user: "Her", text: "Oh really? What were you thinking about? 😊", time: "08:35 AM" },
    { user: "You", text: "How your smile lights up even the darkest days. 🌟", time: "08:36 AM" },
    { user: "Her", text: "Aww, you always know how to make me blush. 😊", time: "08:37 AM" },
    { user: "You", text: "It's true though. You’re like sunshine on a rainy day. ☀️", time: "08:38 AM" },
    { user: "Her", text: "You’re such a sweet talker. But I love it. ❤️", time: "08:39 AM" },
  ],
};

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const chatMessages = messages[id] || [];
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(!id);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add the new message to the chat
      messages[id].push({ user: "You", text: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
      setNewMessage("");
    }
  };

  const handleChatClick = (chatId) => {
    navigate(`/employee/messages/chat/${chatId}`); // Use navigate instead of history.push
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`w-80 bg-white p-2 overflow-y-auto z-30 fixed md:relative transform transition-transform duration-200 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-lg`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Messages</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <ChevronLeftIcon className="w-7 h-7 text-green-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center mb-6 p-1 bg-gray-50 rounded-lg">
          <img src="https://th.bing.com/th/id/OIP.1gqxePGrU4JMYrWZJy1XaQAAAA?pid=ImgDetMain" alt="User" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">Erik Ten Hag</p>
            <p className="text-sm text-gray-500">Info account</p>
          </div>
        </div>
        {/* Pinned Messages */}
        <div className="mb-6 p-1 bg-gray-50 rounded-lg w-full">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleChatClick(user.id)}
              className="flex items-center p-1 mb-6 bg-white rounded-lg shadow-sm hover:bg-gray-100 whitespace-nowrap cursor-pointer"
            >
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.lastMessage}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">{user.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`relative flex-1 flex flex-col bg-white shadow-lg ${!id && "hidden"} md:block`}>
        {/* Chat Header */}
        <div className="p-2 bg-white flex items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-3">
            <ChevronLeftIcon className="w-7 h-7 text-green-600" />
          </button>
          {id && (
            <>
              <img src={users.find((user) => user.id === parseInt(id))?.avatar} alt="User" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h2 className="text-lg font-bold">{users.find((user) => user.id === parseInt(id))?.name}</h2>
                <p className="text-sm text-gray-500">{users.find((user) => user.id === parseInt(id))?.status}</p>
              </div>
              <EllipsisVerticalIcon className="w-6 h-6 text-gray-600 ml-auto cursor-pointer" />
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-2 overflow-y-auto ">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.user === "You" ? "bg-green-600 text-white" : "bg-white"}`}>
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}