import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";

import { getTotalConsumptionForUser } from "../../api/apiDevice/DeviceApi";
import { RootState } from "../../types";

const EnergyConsumptionPage = () => {
  const [chartData, setChartData] = useState<
    { hour: number; totalConsumption: number }[]
  >([{ hour: 0, totalConsumption: 0 }]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const { currentUser } = useSelector((state: RootState) => state.user);

  const fetchConsumption = async () => {
    try {
      if (!selectedDate || !currentUser) {
        return;
      }

      const { data } = await getTotalConsumptionForUser({
        userId: currentUser.id,
        date: selectedDate?.toISOString(),
      });

      setChartData(data);
    } catch (e) {
      console.log("Problem fetching consumption!!!");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchConsumption();
    })();
  }, [selectedDate]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
        />
      </LocalizationProvider>
      {Array.isArray(chartData) && chartData.length > 0 ? (
        <BarChart
          xAxis={[
            {
              id: "barCategories",
              data: chartData.map((entry) => entry.hour),
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: chartData.map((entry) => entry.totalConsumption),
            },
          ]}
          width={800}
          height={500}
        />
      ) : (
        <div>No data to display</div>
      )}
    </div>
  );
};

export default EnergyConsumptionPage;
