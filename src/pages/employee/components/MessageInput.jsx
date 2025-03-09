import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className=" absolute bottom-8 w-full p-4 bg-white border-t  border-gray-200 mb-6">
      <div className="flex items-center gap-2">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500"
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;