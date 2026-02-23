"use client";

import { useState } from "react";
import HolidaysManager from "./components/HolidaysManager";
import FeaturedProfilesManager from "./components/FeaturedProfilesManager";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<"holidays" | "featured">("holidays");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white rounded-md shadow-lg border border-gray-200"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Settings */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        bg-white border-r border-gray-200 shadow-lg lg:shadow-none
        transform transition-all duration-300 ease-in-out
        ${
          sidebarOpen 
            ? 'translate-x-0 w-64' 
            : '-translate-x-full lg:translate-x-0 lg:w-16'
        }
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-lg font-semibold text-[#17323A]">
                  Settings
                </h2>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg className={`w-5 h-5 text-gray-600 transition-transform ${
                  sidebarOpen ? '' : 'rotate-180'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-1">
            <button
              onClick={() => setActiveSection("holidays")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeSection === "holidays"
                  ? "bg-[#0097B2] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {sidebarOpen && <span>Holidays Calendar</span>}
            </button>

            <button
              onClick={() => setActiveSection("featured")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeSection === "featured"
                  ? "bg-[#0097B2] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {sidebarOpen && <span>Featured Profiles</span>}
            </button>
            
            {/* Placeholder para futuros settings */}
            {/* <button
              onClick={() => setActiveSection("other")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeSection === "other"
                  ? "bg-[#0097B2] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {sidebarOpen && <span>Other Settings</span>}
            </button> */}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 p-4 lg:p-6 pt-16 lg:pt-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          {activeSection === "holidays" && <HolidaysManager />}
          {activeSection === "featured" && <FeaturedProfilesManager />}
          {/* {activeSection === "other" && <OtherSettings />} */}
        </div>
      </div>
    </div>
  );
}
