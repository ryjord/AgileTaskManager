import React, { useState, useCallback, useRef, useEffect } from 'react'
import { debounce } from 'lodash'
import { Menu, Moon, Search, Settings, Sun } from "lucide-react"
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/app/redux'
import { setisDarkMode, setIsSidebarCollapsed } from '@/state'


 /* Navbar component provides the top navigation bar with:*/
const Navbar = () => {
    // Redux dispatch function
    const dispatch = useAppDispatch();

    // Select sidebar collapsed state from Redux store
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );

    // Select dark mode state from Redux store
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // State for the search input value
    const [searchTerm, setSearchTerm] = useState('');

    // Debounced search handler using lodash.debounce, persisted via useRef
    // This prevents the debounced function from being recreated on every render
    const debouncedSearch = useRef(
      debounce((value: string) => {
        // TODO: Implement search logic here (e.g., API call, filter, etc.)
      }, 300)
    ).current;

    // Cleanup debounced function on component unmount to prevent memory leaks
    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, [debouncedSearch]);

    // Handler to toggle sidebar collapsed state
    const handleSidebarToggle = useCallback(() => {
      dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    }, [dispatch, isSidebarCollapsed]);

    // Handler to toggle dark mode
    const handleDarkModeToggle = useCallback(() => {
      dispatch(setisDarkMode(!isDarkMode));
    }, [dispatch, isDarkMode]);

    // Conditionally render sidebar toggle button if sidebar is collapsed
    const sidebarToggleButton = isSidebarCollapsed && (
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={handleSidebarToggle}
      >
        <Menu className="h-8 w-8 dark:text-white" />
      </button>
    );

    return (
      <div className='flex items-center justify-between bg-white px-4 py-3 dark:bg-black '>
          {/* Left section: Sidebar toggle and search bar */}
          <div className='flex items-center gap-8'>
              {sidebarToggleButton}
              <div className="relative flex h-min w-[200px]">
                  {/* Search icon inside input */}
                  <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
                  <input
                    className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      debouncedSearch(e.target.value);
                    }}
                  />
              </div>
        </div>

          {/* Right section: Theme toggle, settings link, and divider */}
          <div className='flex items-center'>
              {/* Dark mode toggle button */}
              <button
                type="button"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                onClick={handleDarkModeToggle}
                className={
                    isDarkMode
                    ? `rounded p-2 dark:hover:bg-gray-700`
                    : `rounded p-2 hover:bg-gray-100`
                }>
                  {isDarkMode ? (
                      <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
                  ) : (
                      <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
                  )}
              </button>

              {/* Link to settings page */}
              <Link href="/settings" className='h-min w-min rounded p-2 hover:bg-gray-100'>
                  <Settings className='h-6 w-6 cursor-pointer dark:text-white' />
              </Link>

              {/* Vertical divider (hidden on small screens) */}
              <div className='ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block' />
          </div>
      </div>
    )
}

// Memoize Navbar to prevent unnecessary re-renders
export default React.memo(Navbar)