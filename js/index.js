const projectName = 'scatter-plot';
localStorage.setItem('example_project', 'D3: Scatter Plot');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(function(data) {
	const dataset = data;
	
	const w = 1032;
	const h = 500;
	const padding = 50;
	
	const xScale = d3.scaleTime()
										.domain(d3.extent(dataset, (d) => new Date(d['Year'], 0)))
										.range([padding, w - padding]);

	const yScale = d3.scaleTime()
										.domain(d3.extent(dataset, (d) => new Date(0, 0, 0, 0, 0, d['Seconds'])))
										.range([0, h - padding]);
	
	const yScaleAxis = d3.scaleTime()
										.domain(d3.extent(dataset, (d) => new Date(0, 0, 0, 0, 0, d['Seconds'])))
										.range([h - padding, 0]);
	
	var tooltip = d3.select('body')
									.append('div')
									.attr('id', 'tooltip');
	
	const svg = d3.select('#canvas')
								.append('svg')
								.attr('width', w)
								.attr('height', h);

	svg.selectAll('circle')
			.data(dataset)
			.enter()
			.append('circle')
			.attr('cx', (d, i) => xScale(new Date(d['Year'], 0)))
			.attr('cy', (d, i) => h - padding - yScale(new Date(0, 0, 0, 0, 0, d['Seconds'])))
			.attr('r', 5)
			// .attr('fill', 'gray')
			.attr('class', (d) => 'dot ' + (d['Doping'] !== '' ? 'red' : 'blue'))
			.attr('data-xvalue', (d, i) => d['Year'])
			.attr('data-yvalue', (d, i) => new Date(0, 0, 0, 0, 0, d['Seconds']).toISOString())
			// .append('title')
			// .text(d => d['Name'] + ' (' + d['Nationality'] + '), ' + d['Year'] + ': ' + d['Time'] + (d['Doping'] !== '' ? ' - ' + d['Doping'] : ''))
			.on('mouseover', (d) => tooltip.style('display', 'block').attr('data-year', d['Year']).text(d['Name'] + ' (' + d['Nationality'] + '), ' + d['Year'] + ': ' + d['Time'] + (d['Doping'] !== '' ? ' - ' + d['Doping'] : '')))
			.on('mousemove', (d) => tooltip.style('top', (h + (padding / 2) - yScale(new Date(0, 0, 0, 0, 0, d['Seconds']))) + 'px').style('left', d3.event.pageX + 'px'))
			.on('mouseout', () => tooltip.style('display', 'none'));

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScaleAxis)
									.tickFormat((d, i) => d3.timeFormat('%M:%S')(d));

	svg.append('g')
			.attr('id', 'x-axis')
			.attr('transform', 'translate(0, ' + (h - padding) + ')')
			.call(xAxis);
	
	svg.append('text')             
      .attr('transform', 'translate(' + (w / 2) + ', ' + (h - 10) + ')')
      .style('text-anchor', 'middle')
      .text('Date (Year)');

	svg.append('g')
			.attr('id', 'y-axis')
			.attr('transform', 'translate(' + padding + ', 0)')
			.call(yAxis);
	
	svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -5)
      .attr('x', 0 - (h / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Time (Minutes)');
});