import {html, render as _render} from 'lit-html';
import chart from '../chartjs';

const chartOptions = {
    animation                   : {
        duration : 0
    },
    aspectRatio                 : 2,
    hover                       : {
        animationDuration : 0
    },
    legend                      : {
        display : false,
    },
    responsive                  : true,
    responsiveAnimationDuration : 0,
    scales                      : {
        xAxes : [
            {
                scaleLabel : {
                    display     : true,
                    labelString : localization('Days late'),
                },
            }
        ],
        yAxes : [
            {
                scaleLabel : {
                    display     : true,
                    labelString : localization('No of payments'),
                },
                ticks      :
                    {
                        beginAtZero : true
                    }
            }
        ],
    },
    tooltip                     : {
        enabled : false,
    },
};

/**
 * Render a histogram of delayed payments.
 * The X axis is how many days a payment is delayed,
 * Y how many payments was delayed by the given number of days
 *
 * @param {Number[]} data an array of numbers
 * @param {ParentNode} [target=HTMLTemplateElement]
 */
export function latePaymentHistogramChart (data, target = null)
{
    target = target || document.createElement('template').content;
    
    const labels = Array(data.length);
    labels[0] = localization('On-time');
    for (let i = 1; i < data.length; i++)
        labels[i] = i;
    
    const chartData = {
        labels,
        datasets : [
            {
                data,
                backgroundColor : ({dataIndex}) => dataIndex === 0 ? '#0db000' : '#b0010c',
            }],
    };
    
    _render(html`
<div class="m-group-info mod-pt-28">
    <h3>${localization('Late Payments Histogram')}</h3>
    ${chart('bar', chartData, chartOptions)}
</div>
        `, target);
    
    return target
}

function localization (key)
{
    const translations = {
        'Days late'               :
            {
                'de' : 'Verspätete Tage',
                'pl' : 'Dni opóźnienia',
                'cs' : 'Dní pozdě',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
        'No of payments'          :
            {
                'de' : 'Anz. der Zahlungen',
                'pl' : 'Liczba płatności',
                'cs' : 'Počet plateb',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
        'On-time'                 :
            {
                'de' : 'Pünktlich',
                'pl' : 'Na czas',
                'cs' : 'Včas',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
        'Late Payments Histogram' :
            {
                'de' : 'Histogramm von verspäteten Zahlungen',
                'pl' : 'Histogram opóźnień płatności',
                'cs' : 'Histogram opožděných plateb',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
    };
    
    return translations[key][document.location.pathname.substring(1, 3)] || key
}
