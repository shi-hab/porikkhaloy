import { Spin } from "antd";
import { useGetWithdrawHistoryQuery } from "@/features/affiliate/affiliateApi";

export default function WithdrawHistory() {
  const { data: withdrawHistory, isLoading } = useGetWithdrawHistoryQuery();
  const history = withdrawHistory?.data || [];

  if (isLoading)
    return (
      <div className="grid w-full h-screen place-content-center">
        <Spin size="small" />
      </div>
    );

    

  return (
    <div className="p-4 lg:p-8  mx-auto">
      {/* Header */}
      <div className="bg-blue-800 text-white rounded-xl p-5 shadow-md mb-6 text-center">
        <h2 className="text-2xl font-bold mb-1">💰 Withdraw History</h2>
        <p className="text-white/80 text-sm">
          আপনার সকল Withdraw Request নিচে প্রদর্শিত হয়েছে।
        </p>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-lg font-semibold">
          এখনো কোনো Withdraw Request পাওয়া যায়নি 🕊️
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table Head */}
          <div className="hidden md:flex bg-gray-100 rounded-t-lg font-semibold text-gray-700 p-3 border-b border-gray-200 text-sm">
            <div className="flex-1">ID</div>
            <div className="flex-1">Status</div>
            <div className="flex-1">Requested</div>
            <div className="flex-1">Method</div>
            <div className="flex-1">Payment Number</div>
            <div className="flex-1">Amount</div>
            <div className="flex-1">Balance</div>
          </div>

          {/* Data Rows */}
          {history.map((item) => {
            const affiliate = item?.affiliate;

            return (
              <div
                key={item.id}
                className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all p-3"
              >
                {/* Desktop Columns */}
                <div className="hidden md:flex flex-1 py-1 text-gray-700 font-medium">
                  #{item.id}
                </div>
                <div
                  className={`hidden md:flex flex-1 py-1 font-semibold capitalize ${
                    item.status === "pending"
                      ? "text-yellow-500"
                      : item.status === "approved"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </div>

                <div className="hidden md:flex flex-1 py-1 text-gray-700">
                  {new Date(item.requested_at).toLocaleDateString("bn-BD")}
                </div>
                <div className="hidden md:flex flex-1 py-1 text-gray-700 uppercase">
                  {item.payment_method}
                </div>
                <div className="hidden md:flex flex-1 py-1 text-gray-700">
                  {item.payment_number}
                </div>
                <div className="hidden md:flex flex-1 py-1 text-gray-700">
                  ৳{Number(item.amount).toLocaleString("bn-BD")}
                </div>
                <div className="hidden md:flex flex-1 py-1 text-gray-700">
                  ৳
                  {(
                    (affiliate?.total_earned || 0) -
                    (affiliate?.total_withdrawn || 0)
                  ).toLocaleString("bn-BD")}
                </div>

                {/* Mobile Card */}
                <div className="flex flex-col md:hidden space-y-2 text-gray-700 text-sm">
                  {/* ID */}
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">ID :</span>
                    <span className="font-medium text-gray-800">
                      #{item.id}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Status :
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-white font-semibold text-sm ${
                        item.status === "pending"
                          ? "bg-yellow-500"
                          : item.status === "approved"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {item.status === "approved"
                        ? "Paid"
                        : item.status === "pending"
                        ? "Pending"
                        : "Rejected"}
                    </span>
                  </div>

                  {/* Requested Date */}
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Requested :
                    </span>
                    <span className="text-gray-800">
                      {new Date(item.requested_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Method :
                    </span>
                    <span className="text-gray-800">
                      {item.payment_method.toUpperCase()}
                    </span>
                  </div>

                  {/* Payment Number */}
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Payment Number :
                    </span>
                    <span className="text-gray-800">{item.payment_number}</span>
                  </div>

                  {/* Amount */}
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Amount :
                    </span>
                    <span className="text-gray-800">
                      ৳{Number(item.amount).toLocaleString("bn-BD")}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Balance :
                    </span>
                    <span className="text-gray-800">
                      ৳{Number(affiliate?.balance).toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
