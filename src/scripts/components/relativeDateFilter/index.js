import {html} from 'lit-html';
import {render} from "../../common/util";
import {RelativeDateField} from '../relativeDateField'

const template = ({id, title, toggle_filter_visible, from, till}) => html`
<div id=${id} class="m-expandable m-control--range mod-top-spacing-md">
    <label class="title" @click=${toggle_filter_visible}>${title}</label>
    <div class="m-expandable--content">
        <div class="range-inputs">
            ${from}
            ${till}
        </div>
    </div>
</div>`;

/**
 * Create Relative Date Filter. Allows user to filter loans by issue or listing date from x to y time units ago.
 * E.g. Show only loans that were listed at least three months ago.
 * 
 * The filter consists of two numeric inputs and a time unit selector (days/weeks/months/years).
 * The input field is connected to the "absolute" filter provided by Mintos, the filter that allows user to search for
 * loans issued or listed between specific dates.
 * When the relative input value is changed, the absolute filter is updated.
 * Conversely, when the absolute value is changed by the users, the absolute filter is cleared.
 *
 * @param {string} filterName used to make node ids and the filter title
 * @param {'issued'|'listing'} absInputId the id of the absolute filter input element,
 *  to attach change event listener to.
 *  The suffix (from or till) is added automatically.
 * @returns {ParentNode} filter element
 */
export function relativeDateFilter (filterName, absInputId)
{
    const from = new RelativeDateField(filterName, true, absInputId);
    const till = new RelativeDateField(filterName, false, absInputId);
    const id = `invext-sel-${filterName}-rel`;
    
    const node = render(template({
        id,
        title : `Relative ${filterName.charAt(0).toUpperCase()}${filterName.slice(1)} Date`,
        toggle_filter_visible : e =>
            node.classList.contains('open') ? node.classList.remove('open') : node.classList.add('open'),
        from: from.node,
        till: till.node,
    })).querySelector(`div#${id}`);
    
    [from, till].forEach(filter =>
    {
        filter.installAbsChangeHandler();
    });
    
    return node;
}
