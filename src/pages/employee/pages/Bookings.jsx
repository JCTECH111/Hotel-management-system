import { BarsArrowUpIcon, MagnifyingGlassIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'

function Bookings() {
  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-14">
        <h3 className="text-lg font-semibold mb-4">Booking Activities</h3>
        <div className="w-full flex justify-end  mb-4">
    <Link to="/employee/room-booking" className="flex justify-center items-center gap-2 px-4 py-2 cursor-pointer bg-green-600 font-bold text-white whitespace-nowrap rounded-xl">
         <PlusIcon className="w-5 h-5 "/>
        <button className="cursor-pointer  text-white rounded">Create new booking</button>
    </Link>
    </div>
  
        <div className="p-2">
                    <form className="flex items-center md:flex-row flex-col gap-4 w-full">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by room number..."
                                value=""
                                className="md:w-full w-[20rem] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>

                        {/* Sort Button */}
                        <button
                            type="button"
                            className="flex relative md:left-0 left-[40%] items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:text-gray-700 border-b-3 border-gray-300  rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <BarsArrowUpIcon className="w-5 h-5 " />
                            <span className="">Sort</span>
                        </button>
                    </form>
                </div>
        {/* Responsive Scroll Wrapper */}
        <div className="overflow-auto">
          <table className="w-full min-w-[600px] border-collapse ">
            <thead>
              <tr className="bg-gray-200  text-left">
                <th className="p-3 whitespace-nowrap">Book ID</th>
                <th className="p-3 whitespace-nowrap">Name</th>
                <th className="p-3 whitespace-nowrap">Room</th>
                <th className="p-3 whitespace-nowrap">Check-in</th>
                <th className="p-3 whitespace-nowrap">Check-out</th>
                <th className="p-3 whitespace-nowrap">Guest</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3 whitespace-nowrap">555013</td>
                <td className="p-3 whitespace-nowrap">Boyd Briggs</td>
                <td className="p-3 whitespace-nowrap">Deluxe</td>
                <td className="p-3 whitespace-nowrap">Thu, 23 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">Sat, 25 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">1 Person</td>
                <td className="p-3 whitespace-nowrap text-blue-500 font-semibold">In house</td>
                <td className="p-3 whitespace-nowrap text-gray-700 font-semibold"> <Link to={`/employee/room/9`}><EyeIcon  className='w-7 h-6 cursor-pointer'/></Link> </td>
              </tr>
              <tr className="border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3 whitespace-nowrap">555013</td>
                <td className="p-3 whitespace-nowrap">Boyd Briggs</td>
                <td className="p-3 whitespace-nowrap">Deluxe</td>
                <td className="p-3 whitespace-nowrap">Thu, 23 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">Sat, 25 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">1 Person</td>
                <td className="p-3 whitespace-nowrap text-blue-500 font-semibold">In house</td>
                <td className="p-3 whitespace-nowrap text-gray-700 font-semibold"><Link to={`/employee/room/9`}><EyeIcon  className='w-7 h-6 cursor-pointer'/></Link></td>
              </tr>
              <tr className="border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3 whitespace-nowrap">555013</td>
                <td className="p-3 whitespace-nowrap">Boyd Briggs</td>
                <td className="p-3 whitespace-nowrap">Deluxe</td>
                <td className="p-3 whitespace-nowrap">Thu, 23 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">Sat, 25 Mar 2023</td>
                <td className="p-3 whitespace-nowrap">1 Person</td>
                <td className="p-3 whitespace-nowrap text-blue-500 font-semibold">In house</td>
                <td className="p-3 whitespace-nowrap text-gray-700 font-semibold"><Link to={`/employee/room/9`}><EyeIcon  className='w-7 h-6 cursor-pointer'/></Link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Bookings
