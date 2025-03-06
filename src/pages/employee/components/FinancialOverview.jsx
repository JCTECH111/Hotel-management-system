const FinancialOverview = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
        <p>Revenue Today: <span className="font-bold">$5,000</span></p>
        <p>Outstanding: <span className="font-bold">$1,200</span></p>
        <p>ADR: <span className="font-bold">$200</span> | RevPAR: <span className="font-bold">$180</span></p>
      </div>
    );
  };
  
  export default FinancialOverview;
  