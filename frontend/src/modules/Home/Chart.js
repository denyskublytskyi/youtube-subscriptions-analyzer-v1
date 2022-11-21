import { useRef } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";

const Chart = ({ subscriptionsCountByCountry }) => {
  const theme = useTheme();
  const chartContainerRef = useRef();

  return (
    <Box
      flex={1}
      ref={chartContainerRef}
      sx={
        chartContainerRef?.current
          ? { height: chartContainerRef.current?.clientWidth }
          : {}
      }
    >
      {chartContainerRef.current && (
        <ResponsiveContainer>
          <BarChart
            data={subscriptionsCountByCountry}
            style={{
              fontFamily: theme.typography.fontFamily,
            }}
          >
            <Tooltip />
            <XAxis dataKey="countryNameWithFlag" />
            <Bar fill={theme.palette.primary.main} dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default Chart;
