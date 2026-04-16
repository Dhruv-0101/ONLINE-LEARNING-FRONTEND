import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";
import { FaCubes } from "react-icons/fa";

export default function PublicNavbar() {
  const location = useLocation();

  // Render the navbar only if the current route is "/home"
  if (location.pathname !== "/home") {
    return null;
  }

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-[100] bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/5">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 justify-between items-center">
              <div className="flex items-center gap-8">
                <Link to="/" className="flex flex-shrink-0 items-center gap-2 group transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 group-hover:shadow-purple-500/40 transition-all">
                    <FaCubes className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight group-hover:from-white group-hover:to-white transition-all">
                    Skill Buddy
                  </span>
                </Link>
                
                <div className="hidden md:flex md:space-x-4">
                  {/* Home Link removed as requested */}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Link
                    to="/login"
                    className="relative inline-flex items-center gap-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Track Your Progress
                  </Link>
                </div>

                <div className="-mr-2 flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none transition-colors">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden bg-[#0B0F1A] border-b border-white/5">
            <div className="space-y-1 pb-3 pt-2 px-4 text-center">
              {/* Mobile Home Link removed as requested */}
              <div className="pt-4 pb-2 border-t border-white/5">
                <Link
                  to="/login"
                  className="block px-3 py-3 text-center text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl"
                >
                  Track Your Progress
                </Link>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
