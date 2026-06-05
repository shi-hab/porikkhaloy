import { Link } from "react-router-dom";
function Affiliate() {
  return (
    <div className="  leading-relaxed m-2 p-4 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-600 rounded-sm shadow-lg text-white">
      <h1 className="text-3xl font-extrabold mb-4">
        অ্যাফিলিয়েট সিস্টেম — ঘরে বসেই আয় করুন
      </h1>

      <p className="text-md text-blue-100/90 leading-relaxed mb-7">
        <span className="font-bold text-slate-300">পরীক্ষালয় অ্যাপ'স</span> এর
        সাথে যুক্ত হয়ে আপনি আমাদের এক্সাম ব্যাচ, কোর্স বা প্যাকেজ প্রচার করে
        কমিশন উপার্জন করতে পারবেন। যারা আপনার রেফারাল কুপন ব্যবহার করে
        সাবস্ক্রাইব করবে, তাদের জন্য অতিরিক্ত <strong>১০% ডিসকাউন্ট</strong>{" "}
        থাকবে এবং আপনিও কমিশন পাবেন ২০% থেকে ৫০%।
      </p>

      <div className="bg-white/10 rounded-lg p-4 mb-7">
        <h2 className="text-xl font-semibold mb-2">মূল নিয়মাবলী — সারমর্ম</h2>
        <ul className="list-disc text-sm list-inside space-y-1 text-blue-100">
          <li>
            <strong>কুপন ডিসকাউন্ট:</strong> কুপন ব্যবহারকারীরা পায় অতিরিক্ত ১০%
            ছাড়।
          </li>
          <li>
            <strong>কমিশন রেট:</strong> অ্যাফিলিয়েটদের কমিশন হবে{" "}
            <strong>২০% থেকে ৫০%</strong> (টাইপ/লেভেল অনুযায়ী)।
          </li>
          <li>
            <strong>উইথড্র লিমিট:</strong> মিনিমাম উইথড্র ={" "}
            <strong>৳500</strong>।
          </li>
          <li>
            <strong>কমিশন ট্র্যাকিং:</strong> আপনার ড্যাশবোর্ডে রেফার, কমিশন ও
            পেমেন্ট স্টেটাস দেখা যাবে।
          </li>
        </ul>
      </div>

      <div className="bg-white/8 rounded-lg  mb-7">
        <h3 className="text-lg font-semibold mb-4">দুইটি উদাহরণ (সহজ হিসাব)</h3>

        <div className="mb-6">
          <p className="font-medium">
            উদাহরণ ১ — প্যাকেজ মূল্য: <strong>৳৫০০</strong>
          </p>
          <ol className="list-decimal text-sm leading-5 list-inside ml-2 text-blue-100">
            <li>
              কুপন ডিসকাউন্ট ১০%: ৫০০ × ১০% = ৫০ → ছাত্র/শিক্ষার্থী পাবে ৫০ ছাড়।
            </li>
            <li>
              ছাত্র/শিক্ষার্থী যেহেতু ডিসকাউন্ট পেয়েছে, তারা পে করবে: ৫০০ − ৫০ ={" "}
              <strong>৳৪৫০</strong>.
            </li>
            <li>
              যদি আপনার কমিশন হার ৩০% হয়: ৪৫০ × ৩০% = ০.৩০ × ৪৫০ ={" "}
              <strong>৳১৩৫</strong>.
            </li>
            <li>
              আদতে ছাত্র দিছে ৪৫০ → আপনার উপার্জন হবে ১৩৫ (এবং ছাত্র পেয়েছে ১০%
              ছাড়)।
            </li>
          </ol>
        </div>

        <div>
          <p className="font-medium">
            উদাহরণ ২ — প্যাকেজ মূল্য: <strong>৳১,০০০</strong>
          </p>
          <ol className="list-decimal text-sm  leading-5 list-inside ml-2 text-blue-100">
            <li>কুপন ডিসকাউন্ট ১০%: ১,০০০ × ১০% = ১০০ → ছাত্র পাবে ১০০ ছাড়।</li>
            <li>
              পেমেন্ট হবে: ১,০০০ − ১০০ = <strong>৳৯০০</strong>.
            </li>
            <li>
              কমিশন ধরুন ৫০% (সর্বোচ্চ টিয়ার): ৯০০ × ৫০% = ০.৫০ × ৯০০ ={" "}
              <strong>৳৪৫০</strong>.
            </li>
            <li>অর্থাৎ আপনার কমিশন হবে ৪৫০ এবং ছাত্র পেয়েছে ১০০ টাকা ছাড়।</li>
          </ol>
        </div>
      </div>

      <p className="text-sm text-blue-100/80 mb-4">
        নোট: কমিশন পেমেন্ট ও উইথড্রের সময়কাল, কমিশন টিয়ার ইত্যাদি আপনার
        অ্যাকাউন্টের নীতিমালা অনুযায়ী পরিবর্তিত হতে পারে। সর্বশেষ পলিসি আপনার
        ড্যাশবোর্ডে দেখা যাবে।
      </p>

      <div className="flex justify-center mt-10 items-center gap-3">
        <Link
          to="/affiliate/dashboard"
          className="inline-block px-5 py-2 bg-white text-blue-800 font-semibold rounded-full shadow hover:bg-white/90 transition"
        >
          অ্যাফিলিয়েট ড্যাশবোর্ড
        </Link>
      </div>
    </div>
  );
}

export default Affiliate;
