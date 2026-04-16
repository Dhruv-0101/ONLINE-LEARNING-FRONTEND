import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { FaCubes } from "react-icons/fa";
import { FiShield, FiTerminal, FiLayout } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../redux/slices/authSlice";
import { registerPassKey } from "../../reactQuery/user/usersAPI";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  if (!isAuthenticated || (userProfile?.role !== "student" && userProfile?.role !== "admin")) {
    return null;
  }

  const logoutHandler = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/home");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const registerPasskeyMutation = useMutation({
    mutationKey: ["register-passkey"],
    mutationFn: registerPassKey,
    onSuccess: () => {
      alert("Passkey registered successfully! You can now use 2FA.");
    },
    onError: (error) => {
      console.error("Error registering passkey:", error);
    },
  });

  const navLinks = [
    { name: "Explore Courses", href: "/courses", icon: <FiLayout className="mr-2" /> },
    { name: "My Dashboard", href: "/student-dashboard", icon: <FiTerminal className="mr-2" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Passkey Registration Warning Overlay */}
      <AnimatePresence>
        {registerPasskeyMutation.isPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B0F1A]/95 backdrop-blur-2xl p-6"
          >
            <div className="max-w-md w-full text-center space-y-8">
              <div className="relative mx-auto w-24 h-24">
                 <div className="absolute inset-0 bg-yellow-500/20 blur-[40px] rounded-full animate-pulse"></div>
                 <div className="relative w-24 h-24 rounded-[2.5rem] bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 shadow-2xl">
                    <FiShield size={48} className="animate-bounce" />
                 </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-white uppercase">Securing Account</h2>
                <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                   <p className="text-yellow-500 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      <FiActivity className="animate-pulse" /> Critical Operation in Progress
                   </p>
                   <p className="text-gray-400 text-sm leading-relaxed italic">
                      "Please <span className="text-white font-black not-italic underline decoration-yellow-500 underline-offset-4">DO NOT</span> close this tab, refresh the page, or navigate away. Your secure authentication passkey and 2FA protocol are currently being synchronized with your hardware."
                   </p>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                </div>
                
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">Authentication Server Active</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-[100] bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/5">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 justify-between items-center">
                <div className="flex items-center gap-8">
                  <Link to="/" className="flex flex-shrink-0 items-center gap-2 group transition-all">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-all">
                      <FaCubes className="h-6 w-6 text-white" />
                    </div>
                    <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                      Skill Buddy <span className="text-[10px] text-blue-400 uppercase tracking-widest ml-1 font-black">Student</span>
                    </span>
                  </Link>
  
                  <div className="hidden md:flex md:space-x-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className={classNames(
                          isActive(link.href) 
                            ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                            : "text-gray-400 hover:text-white hover:bg-white/5",
                          "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
  
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => registerPasskeyMutation.mutate()}
                    className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold hover:bg-blue-500/20 transition-all active:scale-95"
                    title="Secure Your Login"
                  >
                    <FiShield className="text-lg" />
                    <span>Passkey Protection</span>
                  </button>
  
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all duration-300 active:scale-95"
                  >
                    <IoLogOutOutline className="text-lg" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
  
                  <div className="-mr-2 flex items-center md:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                      {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="md:hidden bg-[#0B0F1A] border-b border-white/5 pb-4">
              <div className="space-y-1 px-4 pt-2">
                {navLinks.map((link) => (
                  <Disclosure.Button
                    key={link.name}
                    as={Link}
                    to={link.href}
                    className={classNames(
                      isActive(link.href)
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5",
                      "block rounded-lg px-3 py-3 text-base font-medium"
                    )}
                  >
                    {link.name}
                  </Disclosure.Button>
                ))}
                <Disclosure.Button
                  as="button"
                  onClick={() => registerPasskeyMutation.mutate()}
                  className="w-full text-left rounded-lg px-3 py-3 text-base font-medium text-blue-400 hover:bg-blue-500/5"
                >
                  Enable Passkey Protection
                </Disclosure.Button>
                
                <div className="pt-4 mt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                      {userProfile?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{userProfile?.username}</p>
                      <p className="text-gray-500 text-xs">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
