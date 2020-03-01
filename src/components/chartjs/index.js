'use strict';
import Chart from 'chart.js';
import {html, render as _render} from 'lit-html';

/**
 * Render a Chart.js chart
 * 
 * @param {ParentNode} target
 * @param {string} type - chart.js chart type
 * @param {Map} data
 * @param {Map} options
 */
export default function chart (target, type, data, options)
{
    data = data || {};
    options = options || {};
    
    _render(html`
            <div style="position: relative">
                <canvas style="width: 100px; height: 100%"></canvas>
            </div>
        `, target);
    const ctx = target.querySelector('canvas').getContext('2d');
    
    const chart = new Chart(ctx, {
        type,
        data,
        options
    });
    
    // support for live data update
    
    function updateChart ()
    {
        chart.update();
    }
    
    function observe (obj)
    {
        return new Proxy(obj, {
            set : (target, prop, val) =>
            {
                target[prop] = val;
                Promise.resolve().then(updateChart);
                return true;
            }
        });
    }
    
    chart.data = observe(chart.data);
    for (const prop of Object.keys(chart.data))
    {
        chart.data[prop] = observe(chart.data[prop]);
    }
    
    chart.data.datasets = chart.data.datasets.map((dataset) =>
    {
        dataset.data = observe(dataset.data);
        
        return observe(dataset);
    });
    
    window.addEventListener('resize', () =>
    {
        chart.resize();
    });
}
