"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@radix-ui/react-icons";

interface DropdownProps {
  options: string[];
  defaultValue: string;
  //   onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  defaultValue,
  //   onChange,
}) => {
  const onChange = (value: string) => {};
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option}
            value={option}
            onClick={() => onChange(option)}
          >
            {/* calendar icon */}
            <div className="flex items-center gap-2">
              <CalendarIcon />
              {option}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
