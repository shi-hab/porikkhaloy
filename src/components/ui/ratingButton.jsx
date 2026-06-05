import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function RatingButton({
  value,
  defaultValue = 0,
  onChange,
  size = 28,
}) {
  const [hover, setHover] = useState(null);
  const [internalValue, setInternalValue] = useState(defaultValue);

  // default value parent এ পাঠাবে
  useEffect(() => {
    if (defaultValue) {
      onChange?.(defaultValue);
    }
  }, [defaultValue]);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleClick = (star) => {
    if (!isControlled) {
      setInternalValue(star);
    }

    onChange?.(star);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active =
          (hover !== null ? hover : currentValue) >= star;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            className="transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <FaStar
              size={size}
              color={active ? "#facc15" : "#d1d5db"}
            />
          </button>
        );
      })}
    </div>
  );
}