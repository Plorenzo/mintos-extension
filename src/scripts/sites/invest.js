import {relativeDateFilter} from "../components/relativeDateFilter";
import {onNodesAvailable} from "../common/util";

onNodesAvailable({target : 'div#js-additional-filters'}).then(({target}) =>
{
    target.insertBefore(relativeDateFilter('listing', 'listing'),
        target.querySelector('div#sel-listing-date').nextSibling);
    
    target.insertBefore(relativeDateFilter('issue', 'issued'),
        target.querySelector('div#sel-issue-date').nextSibling);
}, console.error);
