import {html, render as _render} from 'lit-html';
import chart from '../chartjs';

const chartOptions = {
    responsive                  : true,
    legend                      : {
        display : false,
    },
    scales                      : {
        yAxes : [
            {
                ticks :
                    {
                        beginAtZero : true
                    }
            }
        ]
    },
    animation                   : {
        duration : 0
    },
    hover                       : {
        animationDuration : 0
    },
    responsiveAnimationDuration : 0,
    tooltip                     : {
        enabled : false,
    },
};

/**
 * Render a histogram of delayed payments.
 * The X axis is how many days a payment is delayed,
 * Y how many payments was delayed by the given number of days
 * 
 * @param {ParentNode} target
 */
export default function latePaymentHistogram (target)
{
    const chartData = {
        labels   : ['0', '1', '2', '3'],
        datasets : [
            {
                data            : [50, 30, 20, 10],
                backgroundColor : [
                    'rgb(91, 125, 52)',
                    'rgb(121, 17, 6)',
                    'rgb(121, 17, 6)',
                    'rgb(121, 17, 6)',
                ],
            }],
    };
    
    _render(html`
        <div>
            <h3>Late Payments Histogram</h3>
            <div class="late-payment-diagram"/>
        </div>
        `, target);
    
    chart(target.querySelector('div.late-payment-diagram'), 'bar', chartData, chartOptions);
}
