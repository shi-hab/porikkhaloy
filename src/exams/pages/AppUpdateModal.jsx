import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useLocation } from "react-router-dom";
import { isApp } from "@/File/device";

const REQUIRED_VERSION = "5.1.14";

// নিরাপদে অ্যান্ড্রয়েড থেকে ভার্সন আনার ফাংশন
const getAppVersion = () => {
  if (typeof window !== "undefined" && window.Android?.getAppVersion) {
    try {
      return String(window.Android.getAppVersion()).trim();
    } catch (e) {
      console.error("Error reading Android version:", e);
    }
  }
  return null;
};

// ভার্সন তুলনা করার পিওর ফাংশন
// current < required হলে -1
// current >= required হলে 0 অথবা 1
const compareVersions = (current, required) => {
  if (!current) return 0;

  // অ্যান্ড্রয়েড যদি শুধু versionCode (যেমন "14") পাঠায়
  // আর required যদি "5.1.14" হয়, তবে শেষ অংশ "14" এর সাথে তুলনা করবে
  const cleanCurrent = String(current).trim();
  const cleanRequired = String(required).trim();

  // যদি সরাসরি পুরো স্ট্রিং মিলে যায়
  if (cleanCurrent === cleanRequired) return 0;

  const currentParts = cleanCurrent.split(".").map((v) => parseInt(v, 10) || 0);
  const requiredParts = cleanRequired.split(".").map((v) => parseInt(v, 10) || 0);

  // যদি অ্যান্ড্রয়েড থেকে এক সংখ্যার ভার্সন কোড আসে (যেমন: 14)
  if (currentParts.length === 1 && requiredParts.length > 1) {
    const singleCode = currentParts[0];
    const targetCode = requiredParts[requiredParts.length - 1]; // "14"
    if (singleCode < targetCode) return -1;
    return 0;
  }

  // স্ট্যান্ডার্ড semver তুলনা (5.1.13 vs 5.1.14)
  const length = Math.max(currentParts.length, requiredParts.length);
  for (let i = 0; i < length; i++) {
    const curr = currentParts[i] || 0;
    const req = requiredParts[i] || 0;

    if (curr > req) return 1;
    if (curr < req) return -1;
  }

  return 0;
};

export default function AppUpdateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const runVersionCheck = () => {
      const isDashboard = location.pathname.startsWith("/dashboard");
      const isRunningInApp = typeof isApp === "function" ? isApp() : !!isApp;

      // ড্যাশবোর্ডে না থাকলে বা অ্যাপ না হলে মোডাল আসবে না
      if (!isDashboard || !isRunningInApp) {
        setIsOpen(false);
        return;
      }

      const currentVersion = getAppVersion();

      // যদি WebView-তে অ্যান্ড্রয়েড অবজেক্ট এখনো তৈরি না হয়, ফলব্যাক দিয়ে ভুল আপডেট দেখাবে না
      if (!currentVersion) {
        return;
      }

      // শুধুমাত্র 5.1.14 এর কম হলে true হবে
      const needsUpdate = compareVersions(currentVersion, REQUIRED_VERSION) < 0;
      setIsOpen(needsUpdate);
    };

    runVersionCheck();

    // WebView ইন্টারফেস প্রস্তুত হতে সামান্য দেরি হলে তার জন্য ব্যাকআপ চেক
    const checkTimer = setTimeout(runVersionCheck, 400);

    return () => clearTimeout(checkTimer);
  }, [location.pathname]);

  const handleUpdate = () => {
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.examapp.porikkhaloy";

    if (typeof window !== "undefined" && window.Android?.openPlayStore) {
      window.Android.openPlayStore();
    } else {
      window.open(playStoreUrl, "_system");
    }
  };

  return (
    <Modal
      open={isOpen}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={null}
      centered
    >
      <div className="flex flex-col items-center justify-center p-4 text-center font-siliguri">
        <span className="mb-4 text-center text-2xl font-bold text-red-600 font-siliguri">
          নতুন আপডেট!
        </span>

        <p className="mb-4 text-base text-gray-700">
          পরীক্ষালয় অ্যাপটির একটি নতুন আপডেট এসেছে। অ্যাপটি ব্যবহারের জন্য
          অনুগ্রহ করে এখনই আপডেট করে নাও।
        </p>

        <Button
          type="primary"
          danger
          block
          onClick={handleUpdate}
          className="h-11 rounded-lg font-semibold font-siliguri"
        >
          এখনই আপডেট করো
        </Button>
      </div>
    </Modal>
  );
}