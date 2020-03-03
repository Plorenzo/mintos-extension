import {render as _render} from 'lit-html';

/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export function assert (selector)
{
    if (selector == null)
    {
        throw 'NullException';
    }
    
    return selector;
}

export function getCurrencyPrefix (text)
{
    return text.match(/^\S+/)[0];
}

export function toNumber (text)
{
    return String(text).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ')
}

export function toFloat (text)
{
    return parseFloat(text.replace(/[^0-9\.\-]/g, ''));
}

export function toDate (text)
{
    return new Date(parseInt(text.split('.')[2]), parseInt(text.split('.')[1]) - 1, parseInt(text.split('.')[0]));
}

/**
 * convert Date to string as per Mintos format
 * @param {Date} d
 * @returns {string}
 */
export function dateToStr (d)
{
    return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
}

export function insertElementBefore (element, node)
{
    node.parentNode.insertBefore(element, node);
}

export function getElementByAttribute (elements, attribute, value)
{
    for (var i = 0; i < elements.length; i++)
    {
        if (elements[i].hasAttribute(attribute) && elements[i].getAttribute(attribute) == value)
        {
            return elements[i];
        }
    }
    
    return null;
}

export const DomMonitor = (function ()
{
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
    return function (source, callback)
    {
        if (!source || !source.nodeType === 1)
        {
            return;
        }
        
        if (MutationObserver)
        {
            var obs = new MutationObserver(function(mutations, observer)
            {
                callback(mutations);
            });
            
            obs.observe(source,
            {
                childList   : true,
                subtree     : false
            });
        }
        else
        if (window.addEventListener)
        {
            source.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

export const DomMonitorAggressive = (function ()
{
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var ready            = true;
    
    return function (source, callback)
    {
        if (!source || !source.nodeType === 1)
        {
            return;
        }
        
        if (MutationObserver)
        {
            var obs = new MutationObserver(function(mutations, observer)
            {
                if (ready && (ready = false) == false)
                {
                    callback(mutations); setTimeout(function () {ready = true}, 0.2);
                }
            });
            
            obs.observe(source,
            {
                childList   : true,
                subtree     : true
            });
        }
        else
        if (window.addEventListener)
        {
            source.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

/**
 * Render TemplateResult created by lit-html.
 *
 * template = (text) => html`<div>${text}</div>`;
 * const node = render(template('hello world'))
 *
 * @param {TemplateResult} templateResult
 * @param {ParentNode} [container=HTMLTemplateElement]
 * @returns {ParentNode} target, or if not passed, a new DocumentFragment, with the rendered template
 */
export function render (templateResult, container = null)
{
    // using <template/> element for the browser defer its execution (e.g. loading images)
    container = container || document.createElement('template');
    _render(templateResult, container.content);
    return container.content;
}

/**
 * Wait for elements matched by given selectors to be available in the document.
 * When all selectors match against the document, the resulting promise'strNotEmpty resolve method is called
 * with a mapping of selector to a matching node. If however the timeout is reached before all selectors match,
 * the promise'strNotEmpty fail method is called with the time passed (millis).
 * The timeout is checked when any mutations are detected in the target node.
 *
 * @param {Map} selectors - list of selectors to match against document.
 * @param {Element} from
 * @param {number} timeout - time in milliseconds after the resulting promise fails.
 * @returns {Promise}
 */
export function onNodesAvailable (selectors, from = undefined, timeout = 30000)
{
    const start = new Date().getTime();
    from = from || document;
    
    function queryAllSelectors (selectors, from = null)
    {
        const result = {};
        for (const name in selectors)
        {
            const selector = selectors[name];
            const node = from.querySelector(selector);
            if (!node)
                return null;
            result[name] = node;
        }
        return result;
    }
    
    return new Promise((resolve, reject) =>
    {
        
        const mo = new MutationObserver(function (mutations)
        {
            const nodes = queryAllSelectors(selectors, from);
            if (nodes)
            {
                mo.disconnect();
                resolve(nodes);
                return;
            }
            const totalWait = new Date().getTime() - start;
            if (totalWait >= timeout)
            {
                mo.disconnect();
                reject(new Error(`Selectors didn't resolve within timeout of ${totalWait}ms`));
            }
        });
        
        mo.observe(from, {
            childList : true,
            subtree   : true
        });
    });
}

/**
 * User language as detected from the current page URL
 */
export const userLang = document.location.pathname.substring(1, 3);
