import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const sampleData = [
  { month: "Jan", prayers: 120 },
  { month: "Feb", prayers: 100 },
  { month: "Mar", prayers: 140 },
  { month: "Apr", prayers: 130 },
  { month: "May", prayers: 150 },
  { month: "Jun", prayers: 110 },
  { month: "Jul", prayers: 160 },
];

export const NamazPerformanceCard: React.FC = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = 300;
    const height = 180;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const x = d3
      .scaleBand()
      .domain(sampleData.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(sampleData, (d) => d.prayers)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g: any) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    const yAxis = (g: any) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))
        .call((g: any) => g.select(".domain").remove());

    svg
      .append("g")
      .attr("fill", "#22c55e") // Tailwind green-500
      .selectAll("rect")
      .data(sampleData)
      .join("rect")
      .attr("x", (d) => x(d.month)!)
      .attr("y", (d) => y(d.prayers))
      .attr("height", (d) => y(0) - y(d.prayers))
      .attr("width", x.bandwidth())
      .attr("rx", 4);

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-green-300 w-full max-w-md">
      <h3 className="text-green-700 font-bold text-lg mb-2">Namaz Performance</h3>
      <svg ref={chartRef} width={300} height={180}></svg>
      <p className="text-sm text-gray-600 mt-2">Monthly Namaz attendance chart</p>
    </div>
  );
};
