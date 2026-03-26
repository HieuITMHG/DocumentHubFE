import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const CustomPieChart = ({
  data,
  color,
  dataKey = "value",
  nameKey = "name",
  innerRadius = 0,
  outerRadius = 100,
  tooltip = null
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={color[index % color.length]}
            />
          ))}
        </Pie>
        {tooltip != null ? <Tooltip content={tooltip} /> : <Tooltip />}
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default CustomPieChart;
