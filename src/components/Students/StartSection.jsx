import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getUserProfileAPI } from "../../reactQuery/user/usersAPI";
import { startSectionAPI } from "../../reactQuery/courseSections/courseSectionsAPI";
import {
  addVideoNoteAPI,
  getVideoNotesAPI,
} from "../../reactQuery/courses/coursesAPI";
import { 
  FiPlay, FiPause, FiEdit, FiBookOpen, FiChevronLeft, FiChevronRight, 
  FiClock, FiActivity, FiZap, FiShield, FiSave, FiX, FiLayers,
  FiMaximize, FiMinimize, FiMenu
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AlertMessage from "../Alert/AlertMessage";
import { useEffect, useRef, useState } from "react";

const StartSection = () => {
  const { courseId } = useParams();
  const videoRef = useRef(null);
  const consoleRef = useRef(null);

  // Fetch data
  const { data, error, isLoading } = useQuery({
    queryKey: ["course-sections"],
    queryFn: () => getUserProfileAPI(courseId),
  });

  const updateProgressMutation = useMutation({
    mutationKey: ["update-course-sections"],
    mutationFn: startSectionAPI,
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ sectionId, videoId, noteData }) =>
      addVideoNoteAPI(sectionId, videoId, noteData),
  });

  // State
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const [noteTimestamp, setNoteTimestamp] = useState("");
  const [noteText, setNoteText] = useState("");
  const [isPaused, setIsPaused] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const courseSections = data?.courseProgress?.courseId?.sections || [];

  const {
    data: notesData,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ["video-notes", selectedSectionId, selectedSection?.videos[videoIndex]?._id],
    queryFn: () => getVideoNotesAPI(selectedSectionId, selectedSection?.videos[videoIndex]?._id),
    enabled: Boolean(selectedSectionId) && Boolean(selectedSection?.videos[videoIndex]?._id),
  });

  useEffect(() => {
    if (courseSections.length > 0 && !selectedSectionId) {
      const defaultSection = courseSections[0];
      setSelectedSectionId(defaultSection._id);
      setSelectedSection(defaultSection);
      setVideoIndex(0);
    }
  }, [courseSections, selectedSectionId]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      consoleRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleProgressChange = () => {
    updateProgressMutation.mutate({ sectionId: selectedSectionId, courseId });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        videoRef.current?.pause();
        setNoteTimestamp(Math.floor(videoRef.current?.currentTime || 0));
        setShowNoteForm(true);
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
      setIsPaused(videoRef.current.paused);
    }
  };

  const handleSectionSelect = (section) => {
    setSelectedSectionId(section._id);
    setSelectedSection(section);
    setVideoIndex(0);
    setProgress(0);
    setIsPaused(true);
    resetNoteState();
  };

  const resetNoteState = () => {
    setNoteText("");
    setShowNoteForm(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNoteMutation.mutate({
      sectionId: selectedSectionId,
      videoId: selectedSection.videos[videoIndex]._id,
      noteData: { timestamp: Number(noteTimestamp), text: noteText.trim() },
    }, {
      onSuccess: () => { resetNoteState(); refetchNotes(); }
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (isLoading) return <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col lg:flex-row pt-20">
      
      {/* SIDEBAR: Navigation Panel */}
      <motion.div 
        animate={{ width: sidebarOpen ? 340 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="bg-black/60 border-r border-white/5 backdrop-blur-3xl shrink-0 overflow-hidden hidden lg:block sticky top-20 h-[calc(100vh-80px)]"
      >
        <div className="p-8 w-[340px] h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <FiLayers className="text-blue-500" size={20} />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Course Curriculum</h3>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 pb-8">
            {courseSections.map((section, idx) => (
              <button
                key={section._id}
                onClick={() => handleSectionSelect(section)}
                className={`w-full text-left p-5 rounded-[1.5rem] border transition-all duration-300 flex items-start gap-4 ${
                  selectedSectionId === section._id 
                    ? 'bg-blue-600 border-blue-400 shadow-[0_10px_30px_rgba(37,99,235,0.3)]' 
                    : 'bg-white/[0.03] border-white/5 hover:border-white/20 text-gray-500'
                }`}
              >
                <span className="text-[10px] font-mono mt-1.5 opacity-40">{(idx + 1).toString().padStart(2, '0')}</span>
                <div>
                  <h4 className={`text-sm font-black tracking-tight ${selectedSectionId === section._id ? 'text-white' : 'text-gray-300'}`}>{section.sectionName}</h4>
                  <p className="text-[10px] mt-1.5 opacity-60 uppercase tracking-widest font-bold">{section.videos?.length || 0} Lessons</p>
                </div>
              </button>
            ))}
          </div>

          {/* Primary Sidebar Actions: Moved here to avoid Navbar overlapping */}
          <div className="pt-6 border-t border-white/10 space-y-3">
             <button 
                onClick={handleProgressChange}
                disabled={updateProgressMutation.isPending}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2"
              >
                <FiPlay className="fill-current" /> {updateProgressMutation.isPending ? "Updating..." : "Resume Section"}
              </button>
              <Link 
                to={`/progress-update/${courseId}`} 
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)] flex items-center justify-center gap-2"
              >
                <FiEdit /> Mark Completed
              </Link>
          </div>
        </div>
      </motion.div>

      {/* Video Player Area */}
      <div className="flex-1 flex flex-col">
        {/* Simplified Header */}
        <div className="p-8 flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hidden lg:block">
              <FiMenu size={20}/>
            </button>
            <div>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] leading-none mb-1.5">Current Section</p>
              <h2 className="text-2xl font-black tracking-tighter">{selectedSection?.sectionName || "Select a Section"}</h2>
            </div>
        </div>

        <div className="px-8 pb-12 space-y-10 max-w-7xl mx-auto w-full">
           {/* VIDEO PLAYER */}
           <div ref={consoleRef} className={`relative group w-full bg-[#161B28] transition-all duration-500 overflow-hidden ${isFullscreen ? 'p-0 h-screen' : 'rounded-[3rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-4'}`}>
              <div className={`relative h-full overflow-hidden bg-black ${isFullscreen ? 'rounded-0' : 'rounded-[2rem]'}`}>
                 <video
                   ref={videoRef}
                   src={selectedSection?.videos[videoIndex]?.url}
                   className="w-full aspect-video object-contain"
                   onTimeUpdate={handleTimeUpdate}
                   onPlay={() => setIsPaused(false)}
                   onPause={() => setIsPaused(true)}
                 />

                 {/* VIDEO CONTROLS */}
                 <div className="absolute inset-x-0 bottom-0 z-20 p-10 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="relative h-1.5 w-full bg-white/5 rounded-full mb-8 cursor-pointer group/bar" onClick={(e) => {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const pos = (e.clientX - rect.left) / rect.width;
                       videoRef.current.currentTime = pos * videoRef.current.duration;
                    }}>
                       <motion.div style={{ width: `${progress}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-8">
                         <button onClick={togglePlay} className="text-white hover:text-blue-500 transition-all hover:scale-125">
                            {isPaused ? <FiPlay size={32} className="fill-current"/> : <FiPause size={32} className="fill-current"/>}
                         </button>
                         <div className="flex items-center gap-3">
                            <button onClick={() => setVideoIndex(p => Math.max(0, p-1))} className="p-2 text-gray-500 hover:text-white transition-all"><FiChevronLeft size={24}/></button>
                            <div className="text-center min-w-[100px]">
                               <p className="text-[10px] font-black uppercase tracking-[0.2rem] text-gray-600 mb-1">Lesson</p>
                               <span className="text-sm font-black font-mono">{videoIndex + 1} / {selectedSection?.videos?.length}</span>
                            </div>
                            <button onClick={() => setVideoIndex(p => Math.min((selectedSection?.videos?.length || 1)-1, p+1))} className="p-2 text-gray-500 hover:text-white transition-all"><FiChevronRight size={24}/></button>
                         </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-[11px] font-mono text-gray-500">{formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}</span>
                          <button onClick={() => { videoRef.current.pause(); setNoteTimestamp(Math.floor(videoRef.current.currentTime)); setShowNoteForm(true); }} className="px-6 py-2.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-yellow-500/20 transition-all">
                             <FiEdit/> Note (N)
                          </button>
                          <button onClick={toggleFullscreen} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400">
                             {isFullscreen ? <FiMinimize size={20}/> : <FiMaximize size={20}/>}
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Note Form Overlay */}
                 <AnimatePresence>
                    {showNoteForm && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 text-center">
                         <div className="w-full max-w-xl p-12 rounded-[4rem] bg-[#1A1F2C] border border-blue-500/10 shadow-3xl relative">
                            <h3 className="text-sm font-black uppercase tracking-[0.4rem] text-blue-500 mb-10 flex items-center justify-center gap-3"><FiEdit/> Lesson Notes</h3>
                            <div className="absolute top-12 right-12 text-[10px] font-mono text-gray-600 bg-black/40 px-3 py-1 rounded-full">{formatTime(noteTimestamp)}</div>
                            <textarea autoFocus value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Write your lesson notes here..." className="w-full h-44 bg-black/40 border border-white/5 rounded-[2rem] p-8 text-sm text-gray-300 focus:border-blue-500/30 outline-none resize-none mb-10 transition-all" />
                            <div className="flex gap-4">
                               <button onClick={handleAddNote} className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(37,99,235,0.2)]">Save Note</button>
                               <button onClick={() => setShowNoteForm(false)} className="px-8 py-5 bg-white/5 hover:bg-white/10 text-gray-500 rounded-[1.5rem] transition-all"><FiX size={24}/></button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* SAVED NOTES */}
           <div className="pt-4 px-4">
              <div className="flex items-center gap-6 mb-10">
                 <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                    <FiBookOpen size={20} className="text-blue-500"/>
                 </div>
                 <h3 className="text-xs font-black uppercase tracking-[0.4rem] text-gray-600">Your Lesson Notes</h3>
                 <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {notesData?.notes?.length > 0 ? notesData.notes.map(note => (
                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={note._id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl rounded-full"></div>
                      <div className="flex items-start gap-4 relative z-10">
                         <button onClick={() => { videoRef.current.currentTime = note.timestamp; videoRef.current.play(); }} className="px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">[{formatTime(note.timestamp)}]</button>
                         <p className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed pt-1.5">{note.text}</p>
                      </div>
                   </motion.div>
                 )) : (
                   <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                      <p className="text-[10px] uppercase tracking-[0.4rem] font-black">No notes saved for this lesson.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StartSection;
