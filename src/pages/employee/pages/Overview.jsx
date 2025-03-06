import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import CheckInList from "../components/CheckInList";
import FinancialOverview from "../components/FinancialOverview";
import Trends from "../components/Trends";
import HousekeepingStatus from "../components/HousekeepingStatus";
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
      <div className="grid md:grid-cols-2 gap-6">
        {/* <CheckInList /> */}
        <FinancialOverview />
      </div>

      {/* Trends Widgets */}
      <Trends />

      Housekeeping & Notifications
      <div className="grid md:grid-cols-2 gap-6">
        <HousekeepingStatus />
        <Notifications />
      </div>

      {/* Booking Activities Table */}
      <BookingTable />
    </div>
  );
};

export default Overview;
