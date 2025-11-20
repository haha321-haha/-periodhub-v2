import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CycleViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 320;
    const height = 320;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius - 25; // Ring thickness

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Cycle Phases Data
    const data = [
      { label: "Menstrual", value: 5, color: "#ec4899" }, // Pink
      { label: "Follicular", value: 9, color: "#a855f7" }, // Purple
      { label: "Ovulation", value: 2, color: "#06b6d4" }, // Cyan
      { label: "Luteal", value: 12, color: "#10b981" }   // Green
    ];

    const pie = d3.pie<any>().value(d => d.value).sort(null);
    const arc = d3.arc<any>().innerRadius(innerRadius).outerRadius(radius);

    // Draw Arcs
    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.9)
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d) || "";
        };
      });

    // Interactive Center Text
    const centerGroup = svg.append("g").attr("class", "center-text");

    centerGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-10px")
      .style("font-size", "3.5rem")
      .style("font-weight", "bold")
      .style("fill", "#7c3aed") // Primary Purple
      .text("14");

    centerGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "20px")
      .style("font-size", "0.875rem")
      .style("fill", "#4b5563")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "1px")
      .text("Ovulation Phase");

    // Subtle Rotation Animation
    d3.select(svgRef.current)
       .append("animateTransform")
       .attr("attributeName", "transform")
       .attr("type", "rotate")
       .attr("from", "0 0 0")
       .attr("to", "360 0 0")
       .attr("dur", "60s")
       .attr("repeatCount", "indefinite");

  }, []);

  return (
    <div className="relative flex items-center justify-center" aria-label="Menstrual Cycle Visualization showing day 14 of Ovulation Phase">
      <div className="absolute inset-0 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <svg ref={svgRef} className="relative z-10 drop-shadow-xl will-change-transform" />
    </div>
  );
};

export default CycleViz;