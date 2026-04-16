import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { FaCubes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function InstructorNavbar() {
  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  if (!isAuthenticated || userProfile?.role !== "instructor") {
    return null;
  }

  const logoutHandler = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Add Course", href: "/instructor-add-course" },
    { name: "My Courses", href: "/instructor-courses" },
    { name: "Course Sections", href: "/instructor-course-sections" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
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
                    Skill Buddy <span className="text-[10px] text-purple-400 uppercase tracking-widest ml-1 font-black">Instructor</span>
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
                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
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
              <div className="pt-4 mt-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
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
  );
}
