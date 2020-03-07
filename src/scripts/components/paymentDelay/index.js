import {html, render} from 'lit-html';
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
                gridLines  : {
                    display : false,
                },
                scaleLabel : {
                    display     : true,
                    labelString : localization('Days late'),
                },
            },
        ],
        yAxes : [
            {
                position   : 'right',
                scaleLabel : {
                    display     : true,
                    labelString : localization('No of payments'),
                },
                ticks      :
                    {
                        beginAtZero : true,
                        stepSize    : 1,
                    },
            },
        ],
    },
    tooltips                    : {
        callbacks : {
            label : function ({label, value})
            {
                return Number(label) ?
                    localization('y payments were late by x days')({
                        y : value,
                        x : label
                    }) :
                    localization('y payments were on time')(value);
            },
            title : function ()
            {
                return '';
            },
        },
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
    
    const labels = Array(Math.max(data.length, 15));
    for (let i = 0; i < labels.length; i++)
        labels[i] = i;
    
    const chartData = {
        labels,
        datasets : [
            {
                data,
                backgroundColor    : ({dataIndex}) => dataIndex === 0 ? '#0db000' : '#b0010c',
                barPercentage      : 1.0,
                categoryPercentage : 1.0,
            }],
    };
    
    render(html`
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
        'Days late'                      :
            {
                'en' : 'Days late',
                'de' : 'Verspätete Tage',
                'pl' : 'Dni opóźnienia',
                'cs' : 'Dní v prodlení',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
        'No of payments'                 :
            {
                'en' : 'No of payments',
                'de' : 'Anz. der Zahlungen',
                'pl' : 'Liczba płatności',
                'cs' : 'Počet plateb',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
        'On-time'                        :
            {
                'en' : 'On-time',
                'de' : 'Pünktlich',
                'pl' : 'Na czas',
                'cs' : 'Včas',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
        'Late Payments Histogram'        :
            {
                'en' : 'Late Payments Histogram',
                'de' : 'Histogramm von verspäteten Zahlungen',
                'pl' : 'Histogram opóźnień płatności',
                'cs' : 'Histogram opožděných plateb',
                'es' : '?',
                'lv' : '?',
                'ru' : '?'
            },
        'y payments were late by x days' :
            {
                en : ({x, y}) => `${y} payments ${x} days late`,
                de : ({x, y}) => `${y} Zahlungen ${x} Tage verspätet`,
                pl : ({x, y}) => `${y} płatności spóźnionych o ${x} dni`,
            },
        'y payments were on time'        :
            {
                en : (y) => `${y} on-time payments`,
                de : (y) => `${y} pünktliche Zahlungen`,
                pl : (y) => `${y} płatności na czas`,
            }
    };
    
    return translations[key][document.location.pathname.substring(1, 3)] ||
        translations[key].en;
}
