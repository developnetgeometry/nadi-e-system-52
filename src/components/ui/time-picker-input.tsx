
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TimePickerInput({ value, onChange, disabled = false }: TimePickerInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  
  useEffect(() => {
    if (value) {
      // Format database time (e.g., "09:00:00") to display time (e.g., "09:00")
      const timeParts = value.split(":");
      if (timeParts.length >= 2) {
        setDisplayValue(`${timeParts[0]}:${timeParts[1]}`);
      } else {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    // Format display time to database time (adding seconds if needed)
    if (newValue) {
      const timeParts = newValue.split(":");
      if (timeParts.length === 2) {
        onChange(`${timeParts[0]}:${timeParts[1]}:00`);
      } else {
        onChange(newValue);
      }
    } else {
      onChange("");
    }
  };
  
  return (
    <Input
      type="time"
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      className="w-32"
    />
  );
}
