class RelativeDate
{
    constructor (fieldName, isFrom, absInputId)
    {
        this.fieldName = fieldName;
        this.isFrom = isFrom;
        
        this.idSuffix = this.isFrom ? 'from' : 'till';
        this.inputId = `${this.fieldName}_rel_${this.idSuffix}`;
        this.selectId = `select_${this.inputId}`;
        
        this.node = this.createRelativeDateElem();
        this.relInput = this.node.querySelector(`input#${this.inputId}`);
        this.relUnit = this.node.querySelector(`select#${this.selectId}`);
        this.absElem = assert(document.querySelector(`input#${absInputId}_${this.idSuffix}`));
        
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
<div id="${divId}" class="${cssClass} rel-date-multi-elem-value-container">
    <input type="text" data-parser="extractNumbers" id="${this.inputId}" name="${this.inputId}" class="input-sm form-control rel-date-multi-elem-value" >
    <select id="${this.selectId}" class="select-sm form-control rel-date-multi-elem-unit">
        <option value="day">D</option>
        <option value="week">W</option>
        <option value="month">M</option>
        <option value="year">Y</option>
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
        const absOldValue = this.absElem.value;
        const unit = this.node.querySelector(`#${this.selectId}`).value;
        const input = this.node.querySelector(`#${this.inputId}`).value;
        this.absElem.value = !!input.trim() ? dateToStr(subtractTime(new Date(), parseInt(input), unit)) : '';
        
        if (this.absElem.value != absOldValue)
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

function createDateFilter (filterName, absInputId)
{
    const title = `Relative ${filterName.charAt(0).toUpperCase()}${filterName.slice(1)} Date`;
    const node = parseElement(`
<div id="sel-${filterName}-rel" class="m-expandable m-control--range mod-top-spacing-md">
    <label class="title">${title}</label>
    <div class="m-expandable--content">
        <div class="range-inputs" />
    </div>
</div>`).firstChild;
    
    node.querySelector('label').addEventListener('click', e =>
    {
        node.classList.contains('open') ? node.classList.remove('open') : node.classList.add('open')
    });
    
    const container = node.querySelector('div.range-inputs');
    const from = new RelativeDate(filterName, true, absInputId);
    const till = new RelativeDate(filterName, false, absInputId);
    
    [from, till].forEach(rel =>
    {
        container.append(rel.node);
        rel.installAbsChangeHandler();
    });
    
    return node;
}
