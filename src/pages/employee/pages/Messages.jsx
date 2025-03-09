import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const users = [
  { id: 1, name: "Harry Maguire", lastMessage: "You need to improve now", time: "09:12 AM", avatar: "https://th.bing.com/th/id/OIF.ECWuLFDwFmERq2gOWVPBTA?pid=ImgDetMain", status: "Online" },
  { id: 2, name: "United Family", lastMessage: "Rashford is typing...", time: "06:25 AM", avatar: "https://th.bing.com/th/id/OIF.ECWuLFDwFmERq2gOWVPBTA?pid=ImgDetMain", status: "Online" },
  { id: 3, name: "Rasmus Højlund", lastMessage: "Bos, I need to talk today", time: "03:11 AM", avatar: "https://th.bing.com/th/id/OIF.ECWuLFDwFmERq2gOWVPBTA?pid=ImgDetMain", status: "Offline" },
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
};

export default function ChatPage() {
  const { id } = useParams();
  const chatMessages = messages[id] || [];
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add the new message to the chat
      messages[id].push({ user: "You", text: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`w-80 bg-white p-2 overflow-y-auto fixed md:relative transform transition-transform duration-200 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-lg`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Messages</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center mb-6 p-1 bg-gray-50 rounded-lg">
          <img src="data:image/jpeg;base64,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" alt="User" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">Erik Ten Hag</p>
            <p className="text-sm text-gray-500">Info account</p>
          </div>
        </div>
        {/* Pinned Messages */}
        <div className="mb-6 p-1 bg-gray-50 rounded-lg w-full">
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/employee/messages/chat/${user.id}`}
              className="flex items-center p-1 mb-6 bg-white rounded-lg shadow-sm hover:bg-gray-100 whitespace-nowrap"
            >
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.lastMessage}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">{user.time}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white shadow-lg">
        {/* Chat Header */}
        <div className="p-4 bg-white flex items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-3">
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
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
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.user === "You" ? "bg-blue-500 text-white" : "bg-white"}`}>
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}