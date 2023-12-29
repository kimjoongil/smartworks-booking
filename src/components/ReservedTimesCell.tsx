import React from "react";

interface ReservedTimesCellProps {
  startTime: string;
  endTime: string;
  selectedDate: string;
  disabled: boolean;
  onSelect: () => void;
}

const ReservedTimesCell: React.FC<ReservedTimesCellProps> = ({
  startTime,
  endTime,
  selectedDate,
  disabled,
  onSelect,
}) => {
  return (
    <div
      className={`time-cell ${disabled ? "disabled" : ""}`}
      onClick={disabled ? undefined : onSelect}    >
      {startTime} - {endTime}
    </div>
  );
};

export default ReservedTimesCell;
