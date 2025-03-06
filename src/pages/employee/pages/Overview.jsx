import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import CheckInOutTable from "../components/CheckInList";
import FinancialOverview from "../components/FinancialOverview";
import Trends from "../components/Trends";
import StaffHousekeeping from "../components/HousekeepingStatus";
import Notifications from "../components/Notifications";
import BookingTable from "../components/BookingTable";

const Overview = () => {
  return (
    <div className=" space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Two Columns - Check-ins & Financial Overview */}
      <div className="grid gap-6">
        <CheckInOutTable />
        {/* <FinancialOverview /> */}
      </div>

      {/* Trends Widgets */}
      {/* <Trends /> */}

        <StaffHousekeeping />
        <Notifications />

      {/* Booking Activities Table */}
      <BookingTable />
    </div>
  );
};

export default Overview;
