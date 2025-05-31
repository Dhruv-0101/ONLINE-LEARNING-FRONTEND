import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getUserProfileAPI } from "../../reactQuery/user/usersAPI";
import { startSectionAPI } from "../../reactQuery/courseSections/courseSectionsAPI";
import {
  addVideoNoteAPI,
  getVideoNotesAPI,
} from "../../reactQuery/courses/coursesAPI";
import { FaPlayCircle, FaPencilAlt, FaBookReader } from "react-icons/fa";
import AlertMessage from "../Alert/AlertMessage";
import { useEffect, useRef, useState } from "react";

const StartSection = () => {
  const { courseId } = useParams();
  const videoRef = useRef(null);

  // Fetch user profile with course sections
  const { data, error, isLoading } = useQuery({
    queryKey: ["course-sections"],
    queryFn: () => getUserProfileAPI(courseId),
  });

  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationKey: ["update-course-sections"],
    mutationFn: startSectionAPI,
  });

  // Mutation to add note
  const addNoteMutation = useMutation({
    mutationFn: ({ sectionId, videoId, noteData }) =>
      addVideoNoteAPI(sectionId, videoId, noteData),
  });

  // State for selected section and video
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [videoIndex, setVideoIndex] = useState(0);

  // State for notes form and video play/pause
  const [noteTimestamp, setNoteTimestamp] = useState("");
  const [noteText, setNoteText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Extract course sections from data
  const courseSections = data?.courseProgress?.courseId?.sections || [];

  // Fetch notes for current video using React Query (v5 style)
  const {
    data: notesData,
    error: notesError,
    isLoading: notesLoading,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: [
      "video-notes",
      selectedSectionId,
      selectedSection?.videos[videoIndex]?._id,
    ],
    queryFn: () =>
      getVideoNotesAPI(
        selectedSectionId,
        selectedSection?.videos[videoIndex]?._id
      ),
    enabled:
      Boolean(selectedSectionId) &&
      Boolean(selectedSection?.videos[videoIndex]?._id),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
  console.log("notesData", notesData);

  useEffect(() => {
    if (courseSections.length > 0) {
      const defaultSection = courseSections[0];
      setSelectedSectionId(defaultSection._id);
      setSelectedSection(defaultSection);
      setVideoIndex(0);
    }
  }, [courseSections]);

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    const section = courseSections.find((s) => s._id === sectionId);
    setSelectedSectionId(sectionId);
    setSelectedSection(section);
    setVideoIndex(0);
    resetNoteState();
  };

  const handleProgressChange = () => {
    updateProgressMutation.mutate({
      sectionId: selectedSectionId,
      courseId,
    });
  };

  const handlePrevVideo = () => {
    setVideoIndex((prev) => Math.max(prev - 1, 0));
    resetNoteState();
  };

  const handleNextVideo = () => {
    if (selectedSection?.videos) {
      setVideoIndex((prev) =>
        Math.min(prev + 1, selectedSection.videos.length - 1)
      );
      resetNoteState();
    }
  };

  const resetNoteState = () => {
    setNoteTimestamp("");
    setNoteText("");
    setShowNoteForm(false);
    setIsPaused(false);
  };

  const handleAddNote = () => {
    if (!noteTimestamp || !noteText.trim()) {
      alert("Please enter both timestamp and note text");
      return;
    }

    const timestampNumber = Number(noteTimestamp);
    if (isNaN(timestampNumber) || timestampNumber < 0) {
      alert("Timestamp must be a positive number");
      return;
    }

    addNoteMutation.mutate(
      {
        sectionId: selectedSectionId,
        videoId: selectedSection.videos[videoIndex]._id,
        noteData: {
          timestamp: timestampNumber,
          text: noteText.trim(),
        },
      },
      {
        onSuccess: () => {
          alert("Note added successfully!");
          resetNoteState();
          refetchNotes(); // refresh notes list
        },
        onError: (error) => {
          alert(
            "Error adding note: " +
              (error?.response?.data?.message || error.message)
          );
        },
      }
    );
  };
  // Function to jump video to the clicked note timestamp
  const handleTimestampClick = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play(); // optional: play the video when jumping
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handlePlay = () => {
    setIsPaused(false);
    setShowNoteForm(false); // hide form if video plays
  };

  const handlePencilClick = () => {
    if (videoRef.current) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      setNoteTimestamp(currentTime);
      setShowNoteForm(true);
    }
  };
  const formatTime = (seconds) => {
    const secNum = parseInt(seconds, 10);
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum % 3600) / 60);
    const secs = secNum % 60;

    const hDisplay = hours > 0 ? hours + ":" : "";
    const mDisplay = (hours > 0 && minutes < 10 ? "0" : "") + minutes + ":";
    const sDisplay = (secs < 10 ? "0" : "") + secs;

    return hDisplay + mDisplay + sDisplay;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sections!</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Start Course Section
      </h2>

      {updateProgressMutation.isPending && (
        <AlertMessage type="loading" message="Enrolling you..." />
      )}
      {updateProgressMutation.isError && (
        <AlertMessage
          type="error"
          message={updateProgressMutation.error?.response?.data?.message}
        />
      )}
      {updateProgressMutation.isSuccess && (
        <AlertMessage type="success" message="Section started successfully!" />
      )}

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Section:
        </label>
        <select
          value={selectedSectionId}
          onChange={handleSectionChange}
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
        >
          {courseSections.map((section, index) => (
            <option key={section._id} value={section._id}>
              {`Section ${index + 1} - ${section.sectionName}`}
            </option>
          ))}
        </select>
      </div>

      {selectedSection && selectedSection.videos?.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <span className="flex items-center font-medium text-gray-800 mb-3 sm:mb-0">
              <FaBookReader className="text-indigo-500 mr-3 text-xl" />
              {`Section ${
                courseSections.findIndex((s) => s._id === selectedSectionId) + 1
              } - ${selectedSection.sectionName}`}
            </span>

            <div className="flex items-center space-x-3">
              <button
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleProgressChange}
              >
                <FaPlayCircle className="mr-2" /> Start
              </button>

              <Link
                to={`/progress-update/${courseId}`}
                className="flex items-center justify-center bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
              >
                <FaPencilAlt className="mr-2" /> Update Progress
              </Link>
            </div>
          </div>

          <div className="relative">
            <video
              className="w-full rounded-md"
              controls
              ref={videoRef}
              onPause={handlePause}
              onPlay={handlePlay}
              src={selectedSection.videos[videoIndex]?.url}
            />

            <div className="text-lg font-semibold text-gray-700 mt-2 text-center">
              {selectedSection.videos[videoIndex]?.title}
            </div>

            {/* Show Add Note Button when paused */}
            {isPaused && !showNoteForm && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={handlePencilClick}
                  className="flex items-center space-x-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded"
                >
                  <FaPencilAlt className="text-indigo-600 text-lg" />
                  <span>Add Note</span>
                </button>
              </div>
            )}

            {/* Show Note Form after button click */}
            {isPaused && showNoteForm && (
              <div className="mt-4 w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-xl">
                <h3 className="font-bold mb-2 text-gray-800">Add Note</h3>

                <label className="block text-sm mb-1">
                  Timestamp (seconds):
                </label>
                <input
                  type="number"
                  min="0"
                  value={noteTimestamp}
                  onChange={(e) => setNoteTimestamp(e.target.value)}
                  className="w-full mb-3 p-2 border border-gray-300 rounded"
                />

                <label className="block text-sm mb-1">Note:</label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows="3"
                  className="w-full mb-3 p-2 border border-gray-300 rounded"
                />

                <div className="flex justify-between">
                  <button
                    onClick={handleAddNote}
                    className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setShowNoteForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevVideo}
                disabled={videoIndex === 0}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Previous Video
              </button>
              <button
                onClick={handleNextVideo}
                disabled={videoIndex === selectedSection.videos.length - 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Next Video
              </button>
            </div>

            {/* Show Notes below video */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
              <h4 className="text-xl font-semibold mb-3 text-gray-700">
                Video Notes
              </h4>

              {notesLoading && <p>Loading notes...</p>}
              {notesError && (
                <p className="text-red-600">
                  Error loading notes: {notesError.message}
                </p>
              )}

              {notesData?.notes?.length === 0 && (
                <p>No notes yet for this video.</p>
              )}

              <ul className="space-y-2">
                {(notesData?.notes || []).map((note) => (
                  <li
                    key={note._id}
                    className="bg-white p-3 rounded shadow-sm flex items-center space-x-2"
                  >
                    <button
                      onClick={() => handleTimestampClick(note.timestamp)}
                      className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                      title={`Go to ${formatTime(note.timestamp)}`}
                    >
                      [{formatTime(note.timestamp)}]
                    </button>
                    <span>{note.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartSection;
