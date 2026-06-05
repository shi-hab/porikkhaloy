import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const SelectField = ({
    label,
    name,
    control,
    options = [],
    placeholder,
    onChange,
    rules = {},
    onRemove,
    defaultValue,
    disabled = false,
}) => {

    return (
        <div className="grid gap-2">
            <Label className="text-md font-bold">{label}</Label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue}
                render={({ field, formState: { errors } }) => (
                    <>
                        <div className="flex items-center gap-2">
                            <Select
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    if (onChange) onChange(val)
                                }}
                                value={field.value || ""}
                                disabled={disabled}
                            >
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder={placeholder} aria-label={`${label} select`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {options && options.map((item) => (
                                        <SelectItem key={item?.id.toString()} value={item?.id.toString()}>
                                            {item?.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* {field.value && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onRemove) onRemove();
                                    }}
                                    className="p-2 rounded-full bg-gray-200 hover:bg-red-200 text-gray-500 hover:text-red-500"
                                    aria-label={`Clear ${label}`}
                                >
                                    <XIcon className="w-5 h-5" aria-hidden="true" />
                                </button>
                            )} */}
                        </div>
                        {errors[name] && <span className="text-red-600">{errors[name]?.message}</span>}
                    </>
                )}
            />
        </div>
    );
}

export default SelectField;
