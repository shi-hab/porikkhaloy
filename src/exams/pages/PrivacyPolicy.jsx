const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-4">
          Welcome to Porikkhaloy! Your privacy is very important to us. This
          Privacy Policy explains how we collect, use, and protect your
          information when you use our mobile app.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Personal information like name and email address.</li>
          <li>
            App usage data such as progress, test scores, and activity logs.
          </li>
          <li>
            Device information including model, OS, and unique device
            identifiers.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>To provide and maintain our app services.</li>
          <li>To personalize your learning experience.</li>
          <li>To send updates, notifications, and important announcements.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          3. Data Sharing and Security
        </h2>
        <p className="text-gray-700 mb-4">
          We do not sell your personal information. We may share your data with
          trusted service providers to enhance app functionality, but we always
          ensure it is secure and used only for app-related purposes.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          4. Your Rights
        </h2>
        <p className="text-gray-700 mb-4">
          You can access, update, or delete your personal information anytime by
          contacting us. You may also opt-out of marketing communications.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          5. Changes to This Policy
        </h2>
        <p className="text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. All changes will
          be posted here with an updated effective date.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          Contact Us
        </h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us
          at: <span className="text-blue-600">porikkhaloy@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
