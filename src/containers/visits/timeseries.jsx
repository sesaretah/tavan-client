import React from "react";
import { List, ListItem, Card, CardHeader, CardContent, CardFooter } from 'framework7-react';
import crypto from 'crypto-js';
import { defaults, Bar } from 'react-chartjs-2';
import { dict } from "../../Dict";

defaults.global.defaultFontFamily = 'iransans';

const TimeSeries = (props) => {
    function series() {
        var result = []
        var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
         };

        var colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#20f08b', '#944dab', '#67f71d', '#650512', '#2f5561', '#e4ae5c']
        props.tasksVisits.map((v) => {
            var d = []
            Object.keys(v.series.data).map(function (key, index) { d.push({ x: new window.ODate(key).toLocaleDateString("fa-IR"), y: index }) })
            result.push({
                label: v.series.title.substring(0,15),
                backgroundColor: dynamicColors(),
                borderColor: 'blue',
                data: d
            })
        }
        )
        return result

    }
    var s1 = {
        label: 's1',
        borderColor: 'blue',
        data: [
            { x: '2017-01-06 18:39:30', y: 100 },
            { x: '2017-01-07 18:39:28', y: 101 },
        ]
    };

    var s2 = {
        label: 's2',
        borderColor: 'red',
        data: [
            { x: '2017-01-07 18:00:00', y: 90 },
            { x: '2017-01-08 18:00:00', y: 105 },
        ]
    };
    if (props.tasksVisits) {
        return (
            <Card>
                <CardHeader></CardHeader>
                <CardContent className='h-300'>
                    <Bar
                        data={{ datasets: series() }}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    type: 'time',
                                    time: {
                                        displayFormats: {
                                            day: 'MM/D'
                                        },
                                    },
                                        scaleLabel: {
                                        display: true,
                                        labelString:  dict.date
                                    }
                                }]
                            }
                        }
                        }
                    />
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        )
    } else {
        return (null)
    }

}
export default TimeSeries;