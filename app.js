const canvas = d3.select(".canva");

const svgWidth = "100%";
const svgHeight = "100%";
// const api_url =
// 	"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
const api_url =
	"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

const svg = canvas
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

//Define the div for tooltip
const div = d3
	.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

function timeStampToDate(mTime) {
	var mDate = new Date(mTime);
	return mDate.toLocaleDateString("en-US");
}

d3.json(api_url).then((data) => {
	//in this fn we put our data together

	const circle = svg
		.selectAll("circle")
		.data(data.features)
		.enter() //enter
		.append("circle"); //append combo

	circle
		.attr(
			"cx",
			(d, i) => 40 + Math.floor(Math.random() * 110 * d.properties.mag)
		)
		.attr("cy", (d, i) => 40 + Math.floor(Math.random() * 200))
		.attr("r", (d, i) => d.properties.mag * 4)
		.attr("fill", "black") //default fill
		.attr("fill", (d, i, n) => d.properties.alert)
		.style("top", 150)
		.on("mousemove", function (event, d) {
			d3.select(this)
				.transition()
				.duration(100) //millisecs
				.style("opacity", 0.7);
			div.transition().duration(200).style("opacity", 0.95);
			div
				.html(
					"<p>" +
						d.properties.mag +
						"</p>" +
						"<p class='text1'>Time:" +
						timeStampToDate(d.properties.time) +
						"</p>" +
						"<p class='text1'>Location:" +
						d.properties.place.split(",")[1] +
						"</p>"
				)
				.style("left", event.pageX + 30 + "px")
				.style("top", event.pageY + "px");
		})
		.on("mouseout", function () {
			d3.select(this)
				.transition()
				.duration(100) //millisecs
				.style("opacity", 1);
			div.transition().duration(0).style("opacity", 0);
		});

	// const texts = svg
	// 	.selectAll("text")
	// 	.data(data.features)
	// 	.enter()
	// 	.append("text");

	// texts
	// 	.attr("x", (d, i) => 20 + i * 60)
	// 	.attr("y", 70)
	// 	.text((d, i) => d.properties.place + " " + d.properties.time)
	// 	.attr("font-size", 8)
	// 	.call(wrap, 30);
});

//
//
//Wrap text fn
function wrap(text, width) {
	text.each(function () {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			x = text.attr("x"),
			y = text.attr("y"),
			dy = 0, //parseFloat(text.attr("dy")),
			tspan = text
				.text(null)
				.append("tspan")
				.attr("x", x)
				.attr("y", y)
				.attr("dy", dy + "em");
		while ((word = words.pop())) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text
					.append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", ++lineNumber * lineHeight + dy + "em")
					.text(word);
			}
		}
	});
}
