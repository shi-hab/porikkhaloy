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
import { Check, ChevronsUpDown } from "lucide-react";
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

  return (
    <div className="min-w-full space-y-1 text-left">
      {/* <Label className="font-semibold">{label} সিলেক্ট করো</Label> */}
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
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="flex items-center justify-start w-full h-auto p-2 text-left"
                >
                  <div className="w-full ">
                    {selectedValues.length === 1 ? (
                      // Show only the first selected value
                      <div className=" !p-1 rounded-sm bg-slate-100 dark:bg-slate-800 font-medium text-wrap">
                        {options.find((item) => item.id === selectedValues[0])
                          ?.title || "Unknown"}
                      </div>
                    ) : selectedValues.length > 1 ? (
                      // Show first selected value and total count for multiple selections
                      <div className="!p-1 rounded-sm  bg-slate-100 dark:bg-slate-800 font-medium text-wrap">
                        {options.find((item) => item.id === selectedValues[0])
                          ?.title || "Unknown"}
                        {"....(" + selectedValues.length + ")"}
                      </div>
                    ) : (
                      `${label} বাছাই করো...`
                    )}
                  </div>
                  {/* <ChevronsUpDown className="w-4 h-8 shrink-0 opacity-60" /> */}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[10000]">
                <Command>
                  {!isMobile && (
                    <CommandInput
                      placeholder={placeholder}
                      readOnly={isMobile}
                    />
                  )}
                  <CommandEmpty>No {label} found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {options.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => {
                            handleSetValue(item.id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValues.includes(item.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.title}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {errors[name] && (
              <span className="text-red-600">{errors[name]?.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
}
