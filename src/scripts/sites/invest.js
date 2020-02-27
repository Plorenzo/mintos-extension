class RelativeDate
{
    constructor (fieldName, isFrom)
    {
        this.fieldName = fieldName;
        this.isFrom = isFrom;
        
        this.idSuffix = this.isFrom ? 'from' : 'till';
        this.inputId = `${this.fieldName}_rel_${this.idSuffix}`;
        this.selectId = `select_${this.inputId}`;
        
        this.node = this.createRelativeDateElem();
        this.relInput = this.node.querySelector(`input#${this.inputId}`);
        this.relUnit = this.node.querySelector(`select#${this.selectId}`);
        this.absElem = document.querySelector(`input#${this.fieldName}_${this.idSuffix}`);
        
        this.relInput.addEventListener('input', this.changeHandlerRel.bind(this));
        this.relUnit.addEventListener('change', this.changeHandlerRel.bind(this));
    }
    
    installAbsChangeHandler ()
    {
        this.absElem.addEventListener('input', this.changeHandlerAbs.bind(this));
    }
    
    createRelativeDateElem ()
    {
        const cssClass = this.isFrom ? 'min' : 'max';
        const divId = `sel-${this.fieldName}-rel-date-${this.idSuffix}`;
        
        return parseElement(`
<div id="${divId}" class="${cssClass}">
    <input type="text" data-parser="extractNumbers" id="${this.inputId}" name="${this.inputId}" class="input-sm form-control" >
    <select id="${this.selectId}" class="select-sm form-control">
        <option value="day">days</option>
        <option value="week">weeks</option>
        <option value="month">months</option>
        <option value="year">years</option>
    </select>
</div>
`).firstChild;
    }
    
    /**
     * Called when the user changes one of the relative selectors - from, to or unit.
     * If both number fields are empty, leave
     */
    changeHandlerRel (event)
    {
        const unit = this.node.querySelector(`#${this.selectId}`).value;
        const input = this.node.querySelector(`#${this.inputId}`).value;
        this.absElem.value = !!input.trim() ? dateToStr(subtractTime(new Date(), parseInt(input), unit)) : '';
        
        document.querySelector('a#filter-button').click();
    }
    
    changeHandlerAbs (event)
    {
        this.relInput.value = '';
    }
    
}

/**
 * @param {Date} date
 * @param {number} value
 * @param {string} unit
 * @returns {Date}
 */
function subtractTime (date, value, unit)
{
    const manipulators = {
        day   : () =>
        {
            const d = new Date(date);
            d.setDate(date.getDate() - value);
            return d;
        },
        week  : () =>
        {
            const d = new Date(date);
            d.setDate(date.getDate() - 7 * value);
            return d;
        },
        month : () =>
        {
            const d = new Date(date);
            d.setMonth(date.getMonth() - value);
            return d;
        },
        year  : () =>
        {
            const d = new Date(date);
            d.setFullYear(date.getFullYear() - value);
            return d;
        },
    };
    return manipulators[unit](date);
}

/**
 * @param {Date} d
 * @returns {string}
 */
function dateToStr (d)
{
    return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
}

onNodesAvailable({target : 'div#sel-listing-date > div.m-expandable--content'}).then(({target}) =>
{
    const container = parseElement(`<div class="range-inputs" />`).firstChild;
    const from = new RelativeDate('listing', true);
    const till = new RelativeDate('listing', false);

    [from, till].forEach(function (rel)
    {
        container.append(rel);
        rel.installAbsChangeHandler();
    });
    
    target.append(container);
}, console.error);
