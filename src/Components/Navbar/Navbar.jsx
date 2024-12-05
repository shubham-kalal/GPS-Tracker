import React from 'react'

const Navbar = ({toggleSidebar}) => {
    return (
        <div>
            <div className="flex justify-between items-center fixed w-full text-white text-xl z-30 bg-slate-700 py-5 sm:px-14 px-5  ">
                <div className="flex items-center">
                <span className="pl-0 sm:pl-10">Admin</span>
                <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" onClick={toggleSidebar} class="inline-flex items-center mt-2 ms-3 text-sm text-gray-100 rounded-lg sm:hidden hover:bg-gray-500 p-1">
                    <span class="sr-only">Open sidebar</span>
                    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>
                </div>
                <span className="">
                    Log out
                </span>
            </div>
        </div>
    )
}

export default Navbar