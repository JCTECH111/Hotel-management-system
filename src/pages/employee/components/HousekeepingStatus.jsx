import { useState } from "react";
import {
    UserGroupIcon,
    WrenchIcon,
    ClipboardDocumentCheckIcon,
    EllipsisVerticalIcon,
    PencilIcon,
    MagnifyingGlassIcon, BarsArrowUpIcon
} from "@heroicons/react/24/outline";

const StaffHousekeeping = () => {
    const [searchMaintenance, setSearchMaintenance] = useState("");
    const [searchCleaning, setSearchCleaning] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [maintenanceRequests, setMaintenanceRequests] = useState([
        { roomNumber: "101", issue: "Leaking faucet", status: "Pending" },
        { roomNumber: "102", issue: "Broken AC", status: "In Progress" },
        { roomNumber: "103", issue: "Faulty TV", status: "Resolved" },
    ]);
    const [cleaningStatus, setCleaningStatus] = useState([
        { roomNumber: "101", status: "Cleaned" },
        { roomNumber: "102", status: "Pending" },
        { roomNumber: "103", status: "In Progress" },
    ]);

    // Handle search for Maintenance table
    const filteredMaintenance = maintenanceRequests.filter((item) =>
        item.roomNumber.includes(searchMaintenance)
    );

    // Handle search for Cleaning table
    const filteredCleaning = cleaningStatus.filter((item) =>
        item.roomNumber.includes(searchCleaning)
    );

    // Handle modal open
    const openModal = (item, type) => {
        setEditData({ ...item, type });
        setModalOpen(true);
    };

    // Handle modal close
    const closeModal = () => {
        setModalOpen(false);
        setEditData(null);
    };

    // Handle status update
    const updateStatus = () => {
        if (editData.type === "maintenance") {
            setMaintenanceRequests((prev) =>
                prev.map((item) =>
                    item.roomNumber === editData.roomNumber
                        ? { ...item, status: editData.status }
                        : item
                )
            );
        } else {
            setCleaningStatus((prev) =>
                prev.map((item) =>
                    item.roomNumber === editData.roomNumber
                        ? { ...item, status: editData.status }
                        : item
                )
            );
        }
        closeModal();
    };

    return (
        <div className="p-1">
            <h1 className="text-2xl font-bold mb-6">Staff & Housekeeping</h1>

            {/* Maintenance Requests */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <WrenchIcon className="w-6 h-6" /> Maintenance Requests
                </h2>

                {/* Search Input */}
                <div className="p-2">
                    <form className="flex items-center md:flex-row flex-col gap-4 w-full">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by room number..."
                                value={searchMaintenance}
                    onChange={(e) => setSearchMaintenance(e.target.value)}
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

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 whitespace-nowrap text-left">Room</th>
                                <th className="py-3 px-4 whitespace-nowrap text-left">Issue</th>
                                <th className="py-3 px-4 whitespace-nowrap text-left">Status</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaintenance.map((request, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 whitespace-nowrap px-4">{request.roomNumber}</td>
                                    <td className="py-3 whitespace-nowrap px-4">{request.issue}</td>
                                    <td className="py-3 whitespace-nowrap px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${request.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : request.status === "In Progress"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="py-3 whitespace-nowrap px-4 text-center">
                                        <button onClick={() => openModal(request, "maintenance")}>
                                            <EllipsisVerticalIcon className="w-6 h-6 cursor-pointer" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cleaning Status */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="w-6 h-6" /> Cleaning Status
                </h2>

                {/* Search Input */}

                <div className="p-2">
                    <form className="flex items-center md:flex-row flex-col gap-4 w-full">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by room number..."
                                value={searchCleaning}
                                onChange={(e) => setSearchCleaning(e.target.value)}
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

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 whitespace-nowrap px-4 text-left">Room</th>
                                <th className="py-3 whitespace-nowrap px-4 text-left">Status</th>
                                <th className="py-3 whitespace-nowrap px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCleaning.map((room, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 whitespace-nowrap px-4">{room.roomNumber}</td>
                                    <td className="py-3 whitespace-nowrap px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${room.status === "Cleaned"
                                                ? "bg-green-100 text-green-800"
                                                : room.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {room.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4  whitespace-nowrap text-center">
                                        <button onClick={() => openModal(room, "cleaning")}>
                                            <EllipsisVerticalIcon className="w-6 h-6 cursor-pointer" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-40 flex justify-center items-center  bg-opacity-50">
                    {/* Blurred Background */}
                    <div className="absolute inset-0 backdrop-blur-sm"></div>

                    {/* Modal Content */}
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-bold mb-4">Edit Status</h3>
                        <select
                            className="p-2 border w-full rounded-md mb-4"
                            value={editData.status}
                            onChange={(e) =>
                                setEditData((prev) => ({ ...prev, status: e.target.value }))
                            }
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Cleaned">Cleaned</option>
                        </select>
                        <button
                            onClick={updateStatus}
                            className="bg-green-600 text-white px-4 py-2 rounded w-full"
                        >
                            Update
                        </button>
                    </div>
                </div>

            )}
        </div>
    );
};

export default StaffHousekeeping;
