import React from "react";
import { FaTimes } from "react-icons/fa";

const VideoModal = ({ videoUrl, videoTitle, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Make sure videoUrl is in the correct format for embedding
  const embedUrl = videoUrl.includes("youtube.com")
    ? videoUrl.replace("watch?v=", "embed/")
    : videoUrl;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{videoTitle}</h3>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="relative pb-[56.25%]">
          {" "}
          {/* 16:9 Aspect Ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
