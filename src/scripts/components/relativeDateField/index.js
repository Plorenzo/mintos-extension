import {html} from "lit-html";
import {assert, dateToStr, render, userLang} from "../../common/util";

const template = ({id, inputId, selectId, cssClass, change_listener}) => html`
<div id=${id} class="${cssClass} invext-reldate-container">

    <input type="text" data-parser="extractNumbers" id=${inputId} name=${inputId}
        class="input-sm form-control invext-reldate-value" @input=${change_listener}>

    <select id=${selectId} class="select-sm form-control invext-reldate-unit" @change=${change_listener}>
        <option value="day">${localization('day')}</option>
        <option value="week">${localization('week')}</option>
        <option value="month">${localization('month')}</option>
        <option value="year">${localization('year')}</option>
    </select>
</div>
`;

export class RelativeDateField
{
    constructor (fieldName, isFrom, absInputId)
    {
        this.fieldName = fieldName;
        this.isFrom = isFrom;
        
        this.idSuffix = this.isFrom ? 'from' : 'till';
        this.inputId = `${this.fieldName}_rel_${this.idSuffix}`;
        this.selectId = `select_${this.inputId}`;
    
        this.node = render(template(
        {
            id              : `invext-sel-${this.fieldName}-reldate-${this.idSuffix}`,
            inputId         : this.inputId,
            selectId        : this.selectId,
            cssClass        : this.isFrom ? 'min' : 'max',
            change_listener : this.changeHandlerRel.bind(this),
        })).querySelector('div');
        
        this.relInput = this.node.querySelector(`input#${this.inputId}`);
        this.relUnit = this.node.querySelector(`select#${this.selectId}`);
        
        this.absElem = assert(document.querySelector(`input#${absInputId}_${this.idSuffix}`));
        this.filterButton = assert(document.querySelector('a#filter-button'));
    }
    
    installAbsChangeHandler ()
    {
        this.absElem.addEventListener('input', this.changeHandlerAbs.bind(this));
    }

    /**
     * Called when the user changes one of the relative selectors - from, till or unit.
     * If both number fields are empty, leave
     */
    changeHandlerRel (event)
    {
        const input = this.relInput.value;
        const unit = this.relUnit.value;
        const newValue = !!input.trim() ? dateToStr(addTime(new Date(), parseInt(input), unit)) : '';
        
        if (this.absElem.value !== newValue)
        {
            this.absElem.value = newValue;
            this.filterButton.click();
        }
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
function addTime (date, value, unit)
{
    const manipulators = {
        day   : () =>
        {
            const d = new Date(date);
            d.setDate(date.getDate() + value);
            return d;
        },
        week  : () =>
        {
            const d = new Date(date);
            d.setDate(date.getDate() + 7 * value);
            return d;
        },
        month : () =>
        {
            const d = new Date(date);
            d.setMonth(date.getMonth() + value);
            return d;
        },
        year  : () =>
        {
            const d = new Date(date);
            d.setFullYear(date.getFullYear() + value);
            return d;
        },
    };
    return manipulators[unit](date);
}

function localization (field)
{
    const translations =
              {
                  'day'   :
                      {
                          'en' : 'Day',
                          'de' : 'Tag',
                          'pl' : 'Dzień',
                          'cs' : 'Dne',
                          'es' : '?',
                          'lv' : '?',
                          'ru' : '?'
                      },
                  'week'  :
                      {
                          'en' : 'Week',
                          'de' : 'Woche',
                          'pl' : 'Tydzień',
                          'cs' : 'Týden',
                          'es' : '?',
                          'lv' : '?',
                          'ru' : '?'
                      },
                  'month' :
                      {
                          'en' : 'Month',
                          'de' : 'Monat',
                          'pl' : 'Miesiąc',
                          'cs' : 'Měsíc',
                          'es' : '?',
                          'lv' : '?',
                          'ru' : '?'
                      },
                  'year'  :
                      {
                          'en' : 'Year',
                          'de' : 'Yahr',
                          'pl' : 'Rok',
                          'cs' : 'Rok',
                          'es' : '?',
                          'lv' : '?',
                          'ru' : '?'
                      },
              };
    
    return translations[field][userLang];
}
        
