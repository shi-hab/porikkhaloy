import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ALL_DIMS, DIM, clearList } from "./qbConfig";

/**
 * সব সিলেকশন URL এ থাকে (?et=2&st=5&sj=3 ...)
 * ফলে Back বাটন, রিফ্রেশ ও শেয়ার সব ঠিকঠাক কাজ করে।
 */
export default function useQbParams() {
  const [sp, setSp] = useSearchParams();

  const sel = useMemo(() => {
    const o = {};
    ALL_DIMS.forEach((d) => {
      const v = sp.get(DIM[d].url);
      o[d] = v ? (d === "type" ? v : Number(v)) : null;
    });
    return o;
  }, [sp]);

  // value = null দিলে সিলেকশন মুছে যায় (এবং নিচের লেভেলও)
  const select = useCallback(
    (dim, value, { browse = [], replace = false } = {}) => {
      setSp(
        (prev) => {
          const n = new URLSearchParams(prev);
          clearList(dim, browse).forEach((d) => n.delete(DIM[d].url));
          if (value == null) n.delete(DIM[dim].url);
          else n.set(DIM[dim].url, String(value));
          return n;
        },
        { replace }
      );
    },
    [setSp]
  );

  const restore = useCallback((search) => setSp(new URLSearchParams(search)), [setSp]);

  return { sel, select, restore };
}