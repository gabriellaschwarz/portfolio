// reference code found at: https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html

// set the dimensions and margins of the graph
const margin = {top: 10, right: 110, bottom: 45, left: 55},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the chart div on cafe.html
const svg = d3.select("#chart")
  .append("svg")
    // using viewBox instead of width/height so the chart shrinks to fit its column
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data -- using my csv file!
d3.csv("wigz_new_vs_returning.csv").then(function(data) {

  // CHANGED: the columns to stack. first in the list = bottom of the bar
  const subgroups = ["returning", "first_timers"]

  // CHANGED: the x axis groups = cafe numbers 1-15
  const groups = data.map(d => d.event_no)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 70]) 
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette uses two discrete hues for groups
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#512920', '#e27274'])

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.event_no))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())

  // axis labels
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 38)
    .attr("text-anchor", "middle")
    .text("Cafe Number");
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .text("Guest Count");

  // legend
  const legendItems = [
    { label: "New", key: "first_timers" },
    { label: "Returning", key: "returning" }
  ];
  legendItems.forEach(function(item, i) {
    svg.append("rect")
      .attr("x", width + 20)
      .attr("y", i * 25)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(item.key));
    svg.append("text")
      .attr("x", width + 42)
      .attr("y", i * 25 + 12)
      .text(item.label);
  });
})
