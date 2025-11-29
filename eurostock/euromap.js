function draweuromap(file, element, title, subtitle){
    (async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());
    const path =file
    const data = await fetch(path
        
    ).then(response => response.json());

    Highcharts.mapChart(element, {
        chart: {
            map: topology
        },
        title: {
            text: title,
            align: 'left'
        },
        subtitle: {
            text: subtitle,
            align: 'left'
        },
        mapNavigation: {
            enabled: true
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>Station:{point.id}<br>Lat: {point.lat:.2f}, Lon: ' +
                '{point.lon:.2f}'
        },
        plotOptions: {
            mappoint: {
                cluster: {
                    enabled: true,
                    allowOverlap: false,
                    animation: {
                        duration: 450
                    },
                    layoutAlgorithm: {
                        type: 'grid',
                        gridSize: 70
                    },
                    zones: [{
                        from: 1,
                        to: 4,
                        marker: {
                            radius: 13
                        }
                    }, {
                        from: 5,
                        to: 9,
                        marker: {
                            radius: 15
                        }
                    }, {
                        from: 10,
                        to: 15,
                        marker: {
                            radius: 17
                        }
                    }, {
                        from: 16,
                        to: 20,
                        marker: {
                            radius: 19
                        }
                    }, {
                        from: 21,
                        to: 100,
                        marker: {
                            radius: 21
                        }
                    }]
                }
            }
        },
        series: [{
            name: 'Europe',
            accessibility: {
                exposeAsGroupOnly: true
            },
            borderColor: '#A0A0A0',
            nullColor: 'rgba(177, 244, 177, 0.5)',
            showInLegend: false
        }, {
            type: 'mappoint',
            enableMouseTracking: true,
            accessibility: {
                point: {
                    descriptionFormat: '{#if isCluster}' +
                            'Grouping of {clusterPointsAmount} points.' +
                            '{else}' +
                            '{name}, country code: {country}.' +
                            '{/if}'
                }
            },
            colorKey: 'clusterPointsAmount',
            name: 'Cities',
            data: data,
            color: Highcharts.getOptions().colors[5],
            marker: {
                lineWidth: 1,
                lineColor: '#fff',
                symbol: 'mapmarker',
                radius: 8
            },
            dataLabels: {
                verticalAlign: 'top'
            }
        }], 
        responsive: {
                        rules: [{
                                    condition: {
                                        maxWidth: 500
                                    },
                                }]
                            }
    });

})()};
