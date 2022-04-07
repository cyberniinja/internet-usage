import * as d3 from 'd3';

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
	width = 460 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
	.select('#chart-1')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.call(responsivefy)
	.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv(
	'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv',

	// When reading the csv, I must format variables:
	function (d) {
		return { date: d3.timeParse('%Y-%m-%d')(d.date), value: d.value };
	}
).then(
	// Now I can use this dataset:
	function (data) {
		// Add X axis --> it is a date format
		const x = d3
			.scaleTime()
			.domain(
				d3.extent(data, function (d) {
					return d.date;
				})
			)
			.range([0, width]);
		svg
			.append('g')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(x));

		// Add Y axis
		const y = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(data, function (d) {
					return +d.value;
				}),
			])
			.range([height, 0]);
		svg.append('g').call(d3.axisLeft(y));

		// Add the line
		svg
			.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 1.5)
			.attr(
				'd',
				d3
					.line()
					.x(function (d) {
						return x(d.date);
					})
					.y(function (d) {
						return y(d.value);
					})
			);
	}
);

// SOURCE: https://brendansudol.com/writing/responsive-d3
function responsivefy(svg) {
	// get container + svg aspect ratio
	var container = d3.select(svg.node().parentNode),
		width = parseInt(svg.style('width')),
		height = parseInt(svg.style('height')),
		aspect = width / height;

	// add viewBox and preserveAspectRatio properties,
	// and call resize so that svg resizes on inital page load
	svg
		.attr('viewBox', '0 0 ' + width + ' ' + height)
		.attr('perserveAspectRatio', 'xMinYMid')
		.call(resize);

	// to register multiple listeners for same event type,
	// you need to add namespace, i.e., 'click.foo'
	// necessary if you call invoke this function for multiple svgs
	// api docs: https://github.com/mbostock/d3/wiki/Selections#on
	d3.select(window).on('resize.' + container.attr('id'), resize);

	// get width of container and resize svg to fit it
	function resize() {
		var targetWidth = parseInt(container.style('width'));
		svg.attr('width', targetWidth);
		svg.attr('height', Math.round(targetWidth / aspect));
	}
}
