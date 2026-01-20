import { Bar } from "react-chartjs-2";

const CategoryComparisonChart = ({ data }) => {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.category),
        datasets: [
          {
            label: "This Month",
            data: data.map((d) => d.current),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
          {
            label: "Last Month",
            data: data.map((d) => d.previous),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      }}
    />
  );
};

export default CategoryComparisonChart;
