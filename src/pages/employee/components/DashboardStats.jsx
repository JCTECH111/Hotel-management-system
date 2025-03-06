const DashboardStats = () => {
    const stats = [
      { title: "Check-In", value: "✔", color: "bg-green-500" },
      { title: "Check-Out", value: "✖", color: "bg-red-500" },
      { title: "Room Occupancy", value: "80%", color: "bg-blue-500" },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} text-white p-5 rounded-lg shadow-md`}>
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default DashboardStats;
  