var width = 450;
var height = 450;

var margin = {top: 20, right: 20, bottom: 20, left:20}

var radius = Math.min(width, height) / 2 - 20

var svg = d3.select("#nationalities").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

var pieSet1 = {}
var pieSet2 = {
	algo: 5,
	otra: 10
}

fetch('https://covid2020-api.herokuapp.com/infectedByState')
.then(result => result.json()).then(data => {
	update(data)
	pieSet1 = data
})

var color = d3.scaleOrdinal()
.range(d3.schemeDark2)

const update = (data) => {
	var pie = d3.pie()
	.value((d) => d.value)
	.sort((a, b) => d3.ascending(a.key, b.key))

	var g = svg.selectAll("path")
	.data(pie(d3.entries(data)))

	g
	.enter()
    .append('path')
    .merge(g)
	.on("mouseover", function(d, i) {
		svg.append("text")
		  .attr("dy", d3.mouse(this)[1])
		  .attr("dx", d3.mouse(this)[0])
		  .style("text-anchor", "middle")
		  .style("font-size", 20)
		  .attr("class","label")
		  .style("fill", "white")
		  .text(d.data.key)
	})
	.on("mouseout", () => svg.select(".label").remove())
    .transition()
    .duration(300)
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)
	.attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', (d) => color(d.data.key))

	g
    .exit()
    .remove()
}

// $("#data1").click(function () {
// 	update(pieSet1)
// 	$(this).prop("disabled", true)
// 	$("#data2").prop("disabled", false)
// })

// $("#data2").click(function () {
// 	update(pieSet2)
// 	$(this).prop("disabled", true)
// 	$("#data1").prop("disabled", false)
// })