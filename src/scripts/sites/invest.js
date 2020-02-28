onNodesAvailable({target : 'div#js-additional-filters'}).then(({target}) =>
{
    target.insertBefore(createDateFilter('listing', 'listing'), target.querySelector(
        'div#sel-listing-date').nextSibling);
    target.insertBefore(createDateFilter('issue', 'issued'), target.querySelector(
        'div#sel-issue-date').nextSibling);
}, console.error);
