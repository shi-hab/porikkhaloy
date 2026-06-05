import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useMediaQuery from "@/exams/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

export function MultipleSelector({
    label,
    name,
    options,
    onChange,
    control,
    placeholder,
    defaultValue,
    rules
}) {
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState(defaultValue || []);

    const isMobile = useMediaQuery('(max-width: 768px)');

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
        <div className="space-y-1 min-w-full text-left ">
            <Label className="font-semibold">{label}</Label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue}
                render={({ field, formState: { errors } }) => (
                    <>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full h-auto flex items-center justify-start p-2 text-left"
                                >
                                    <div className="w-full">
                                        {
                                            selectedValues.length ?
                                                selectedValues?.map((val) => (
                                                    <div key={val} className="px-2 my-1 p-1 rounded bg-slate-200 dark:bg-slate-800 text-sm font-medium text-wrap">
                                                        {options.find((item) => item.id === val)?.title || "Unknown"}
                                                    </div>
                                                ))
                                                : `Select ${label}...`
                                        }
                                    </div>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
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
                                            {
                                                options?.map((item) => (
                                                    <CommandItem
                                                        key={item.id}
                                                        value={item.id}
                                                        onSelect={() => handleSetValue(item.id)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedValues.includes(item.id) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {item.title}
                                                    </CommandItem>
                                                ))
                                            }
                                        </CommandList>
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors[name] && <span className="text-red-600">{errors[name]?.message}</span>}
                    </>
                )}
            />
        </div>
    );
}