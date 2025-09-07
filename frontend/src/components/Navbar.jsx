import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">AI Health Chatbot</h1>
      <div>
        <Link className="px-3" to="/">Login</Link>
        <Link className="px-3" to="/signup">Signup</Link>
        <Link className="px-3" to="/chat">Chat</Link>
      </div>
    </nav>
  );
}
