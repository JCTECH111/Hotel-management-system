import React from 'react';

const GuestHome = () => {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Welcome to Your Dashboard!</h1>
            <p className="text-lg text-center mb-6">Here are some guidelines to help you navigate:</p>
            <ul className="list-disc list-inside mb-6">
                <li className="mb-2">View your bookings by clicking on the "My Bookings" section.</li>
                <li className="mb-2">Manage your account settings in the "Account Settings" section.</li>
                <li className="mb-2">If you need assistance, visit the "Help" section for FAQs and support.</li>
            </ul>
            <p className="text-lg text-center">Enjoy your stay!</p>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-2">Additional Resources:</h2>
                <p className="mb-2">- Check out our <a href="/faq" className="text-blue-500 underline">FAQ</a> for common questions.</p>
                <p>- Contact support if you have any issues.</p>
            </div>
        </div>
    );
};

export default GuestHome;
