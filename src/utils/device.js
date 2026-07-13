export const isApp = () => {
  if (typeof navigator === "undefined") return false;

  return navigator.userAgent.includes("porikkhaloy-app/");
};

export const getAppVersion = () => {
  if (typeof navigator === "undefined") return null;

  const match = navigator.userAgent.match(/porikkhaloy-app\/([\d.]+)/i);
  return match ? match[1] : null;
};