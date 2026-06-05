import { RiWirelessChargingLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function FreeExamCard() {
  return (
    <Link to="/free-batch">
      <div className="flex justify-between items-center bg-white p-3 mt-4 rounded-md shadow-sm border">
        <p className="flex items-center gap-2 text-lg font-semibold font-siliguri text-gray-700">
          <RiWirelessChargingLine className="text-orange-500 text-3xl" />
          ফ্রি লাইভ এক্সাম চলছে...
        </p>

        <div className="rounded-md px-4 py-2 bg-orange-500 text-white shadow hover:shadow-md animate-borderSpark">
          <p className="font-siliguri font-bold transition-all duration-300">
            এক্সাম দাও!
          </p>
        </div>
      </div>
    </Link>
  );
}

export default FreeExamCard;