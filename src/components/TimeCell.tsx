"use client";

import { Button, Grid } from "@mui/material";

interface TimeCellProps {
  time: string;
  isStartSelectable: boolean;
  isSelected: boolean;
  isReserved: boolean;
  onTimeClick: (time: string) => void;
}

const TimeCell: React.FC<TimeCellProps> = ({
  time,
  isStartSelectable,
  isSelected,
  isReserved,
  onTimeClick,
}) => {
  const cellStyle = {
    backgroundColor: isReserved
      ? "bg-slate-500"
      : isSelected
      ? "black"
      : "transparent",
    color: isReserved ? "text-slate-800" : isSelected ? "white" : "inherit",
  };

  return (
    <Grid item>
      <Button
        variant="contained"
        color={
          isReserved
            ? "secondary"
            : isSelected
            ? "secondary"
            : isStartSelectable
            ? "secondary"
            : "primary"
        }
        //color={isReserved ? "secondary" : isSelected ? "secondary" : "inherit"}
        onClick={() => !isReserved && onTimeClick(time)}
        disabled={isReserved}
        fullWidth
        style={cellStyle}
      >
        {time}
      </Button>
    </Grid>
  );
};

export default TimeCell;
