(function() {
  d3.json("./includes/statewise-literacy-resource.json", function(err, data) {
    if (err) {
      console.log("Error: " + err);
      return;
    }

    dataViz(data);
  });

  function dataViz(inputData) {

    var margin = {
      top: 20,
      right: 0,
      bottom: 100,
      left: 80
    },
    width = 1270 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

    var n = 3; // number of layers
    var headers = d3.keys(inputData[0]).filter(function(key) {
      return key !== "areaName";
    });
    var layers = d3.layout.stack()(headers.map(function(genderLiteracy) {

      return inputData.map(function(d) {

        return {
          x: d.areaName,
          y: +d[genderLiteracy]
        };

      });
    }));

    var yGroupMax = d3.max(layers, function(layer) {
      return d3.max(layer, function(d) {
        return d.y;
      });
    });
    var yStackMax = d3.max(layers, function(layer) {
      return d3.max(layer, function(d) {
        return d.y0 + d.y;
      });
    });

    var svg = d3.select(".row").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scale.ordinal()
      .domain(layers[0].map(function(d) { return d.x; }))
      .rangeRoundBands([25, width], .1);

    var y = d3.scale.linear()
      .domain([0, yGroupMax / 144, yGroupMax])
      .range([height, height / 2, 0]);

    var color = d3.scale.ordinal()
      .domain(headers)
      .range(["#a05d56", "#8a89a6"]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .tickSize(0)
      .tickPadding(6)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

    var layer = svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) {
      return color(i);
    });

    var rect = layer.selectAll("rect")
      .data(function(d) {
      return d;
    })
      .enter().append("rect")
      .attr("x", function(d, i, j) {
      return xScale(d.x) + xScale.rangeBand() / n * j;
    })
      .attr("y", function(d) {
      return y(d.y);
    })
      .attr("width", xScale.rangeBand() / n)
      .attr("height", function(d) {
      return height - y(d.y);
    });

    /* ******** Tooltip *************/
    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 80)
      .attr("height", 20)
      .attr("fill", "#98abc5")
      .style("opacity", 0.5);
    tooltip.append("text")
      .attr("x", 40)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    rect.on("mouseover", function() {
      tooltip.style("display", null);
    })
      .on("mouseout", function() {
      tooltip.style("display", "none");
    })
      .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y);
    });

    //********** AXES ************
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text").style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
      return "rotate(-45)"
    });

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(20,0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr({
      "x": -150,
      "y": -70
    })
      .attr("dy", ".75em")
      .style("text-anchor", "end")
      .text("# population");

    var legend = svg.selectAll(".legend")
      .data(headers.slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
      return "translate(-20," + i * 20 + ")";
    });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    var formatText = {
      "totalIlliterate": "Total Illiterate",
      "totalLiterate": "Total Literate"
    };
    legend.append("text")
      .attr("id", "legendText")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
      return formatText[d];
    });

  }
})();