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
import useMediaQuery from "../../../../features/hooks/useMediaQuery";
import useLocalStorage from "../../../../features/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { Check, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

export const AutoSearchSelect = ({
  label,
  name,
  control,
  options = [],
  placeholder,
  onChange,
  rules = {},
  onRemove,
  defaultValue,
  showRemoveButton = true,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCatName, setSelectedCatName] = useState("");
  const [selectedCatId, setSelectedCatId] = useLocalStorage({
    key: name,
    defaultValue: "",
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (selectedCatId && options.length > 0) {
      const selectedOption = options.find(
        (item) => item.id.toString() === selectedCatId
      );

      if (selectedOption) {
        setSelectedCatName(
          selectedOption.title.charAt(0).toUpperCase() +
            selectedOption.title.slice(1)
        );
      }
    }
  }, [selectedCatId, options]);

  const handleSelect = (item) => {
    setSelectedCatId(item.id.toString());
    setSelectedCatName(item.title);
    setPopoverOpen(false);
    if (onChange) onChange(item.id.toString());
  };

  return (
    <div className="">
      <Label className="font-bold text-md">{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, formState: { errors } }) => (
          <>
            <div className="flex items-center gap-2 ">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start w-full">
                    {selectedCatName ? selectedCatName : placeholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    {/* <CommandInput placeholder={placeholder} /> */}
                    {!isMobile && (
                      <CommandInput
                        placeholder={placeholder}
                        readOnly={isMobile}
                      />
                    )}
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {options &&
                          options.map((item) => (
                            <CommandItem
                              key={item?.id.toString()}
                              onSelect={() => {
                                field.onChange(item?.id.toString());
                                handleSelect(item);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCatId.includes(item?.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />

                              {item?.title.charAt(0).toUpperCase() +
                                item?.title.slice(1)}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {name !== "section" &&
                name !== "group" &&
                name !== "pkgSection" &&
                showRemoveButton &&
                field.value && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onRemove) onRemove();
                      setSelectedCatName("");
                      setSelectedCatId("");
                    }}
                    className="p-2 text-gray-500 bg-gray-200 rounded-full hover:bg-red-200 hover:text-red-500"
                  >
                    <XIcon className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
            </div>

            {errors[name] && (
              <span className="text-red-600">{errors[name]?.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
};
