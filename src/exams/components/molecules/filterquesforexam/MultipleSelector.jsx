import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useMediaQuery from "@/exams/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

export function MultipleSelector({
  label,
  name,
  options,
  onChange = null,
  control,
  placeholder,
  defaultValue,
  rules,
}) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(defaultValue || []);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSetValue = (val) => {
    let updatedValues;
    if (selectedValues.includes(val)) {
      updatedValues = selectedValues.filter((item) => item !== val);
    } else {
      updatedValues = [...selectedValues, val];
    }

    setSelectedValues(updatedValues);

    if (onChange) {
      onChange(updatedValues);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedValues([]);
    if (onChange) {
      onChange([]);
    }
  };

  return (
    <div className="w-full space-y-2 text-left">
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, formState: { errors } }) => (
          <>
            <Popover
              className="w-full !z-[10000]"
              open={open}
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <button
                  role="combobox"
                  aria-expanded={open}
                  className="w-full transition-all duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                >
                  <div className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                    {selectedValues.length === 0 ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm font-medium">
                          {label} বাছাই করো...
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-gray-400 transition-transform duration-300",
                            open && "rotate-180"
                          )}
                        />
                      </div>
                    ) : selectedValues.length === 1 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                          <span className="font-semibold text-gray-800 text-sm">
                            {options.find((item) => item.id === selectedValues[0])
                              ?.title || "Unknown"}
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-gray-400 transition-transform duration-300",
                            open && "rotate-180"
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                            <span className="font-semibold text-gray-800 text-sm">
                              {options.find(
                                (item) => item.id === selectedValues[0]
                              )?.title || "Unknown"}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                            <span className="text-xs font-bold text-blue-700">
                              +{selectedValues.length - 1}
                            </span>
                          </span>
                        </div>
                        <button
                          onClick={handleClear}
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="z-[10000] p-0 shadow-lg border-gray-200">
                <Command>
                  {!isMobile && (
                    <CommandInput
                      placeholder={placeholder || `${label} খুঁজুন...`}
                      readOnly={isMobile}
                      className="border-b border-gray-200 rounded-none"
                    />
                  )}
                  <CommandEmpty>
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                      <span className="text-sm">কোনো {label} খুঁজে পাওয়া যায়নি</span>
                    </div>
                  </CommandEmpty>
                  <CommandGroup className="w-full">
                    <CommandList className="max-h-64">
                      {options.map((item, index) => (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => {
                            handleSetValue(item.id);
                          }}
                          className="cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div
                              className={cn(
                                "h-5 w-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
                                selectedValues.includes(item.id)
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500"
                                  : "border-gray-300 hover:border-blue-400"
                              )}
                            >
                              {selectedValues.includes(item.id) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-sm transition-colors duration-200",
                                selectedValues.includes(item.id)
                                  ? "font-semibold text-gray-900"
                                  : "text-gray-700"
                              )}
                            >
                              {item.title}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {errors[name] && (
              <span className="text-sm text-red-500 font-medium">
                {errors[name]?.message}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
}