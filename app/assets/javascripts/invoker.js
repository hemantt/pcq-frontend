// ------------ Actor Select ------------
(function () {
    'use strict';

    function changeActorList(service) {
        const actorListRaw = document.querySelector('#invoker-script').innerHTML;
        const actorList = actorListRaw ? JSON.parse(actorListRaw.trim()) : [];

        if (actorList.length === 0) {
            document.querySelector('#actor-select').innerHTML = '';
        } else {
            let options = '';
            for (const actor in actorList[service]) {
                options += `<option value="${actorList[service][actor]}">${actorList[service][actor]}</option>`;
            }
            document.querySelector('#actor-select').innerHTML = options;
        }

        // Set selected actor if possible
        const actorInputValue = document.querySelector('#actor').value;
        if (actorList[service].includes(actorInputValue)) {
            document.querySelector('#actor-select').value = actorInputValue;
        }
    }

    // Add onChange event listener
    document.querySelector('#service-select')
        .addEventListener('change', (evt => changeActorList(evt.target.value)));
    // Initialise the select options
    window.onload = () => changeActorList(document.querySelector('#service-select').value);

}).call(this);

// ------------ Clear ------------
(function() {
    'use strict';

    const clearButton = document.querySelector('#clear-btn');
    const form = document.getElementById('invoker-form');

    const clear = function (e) {
        e.preventDefault();
        // Reset() does not clear hidden inputs so the csrf value is safe.
        form.reset();
    };

    clearButton.addEventListener('click', clear);
    clearButton.addEventListener('touchstart', clear);

}).call(this);

// ------------ Fill ------------
(function () {
    'use strict';

    const fillButton = document.querySelector('#fill-btn');

    const fill = function (e) {
        e.preventDefault();

        const inputFields = document.getElementById('invoker-form').getElementsByTagName('input');
        const emptyFields = [];
        for (const field of inputFields) {
            if (field.value.length === 0) {
                emptyFields.push(field.name);
            }
        }

        const service = document.querySelector('#service-select').value;
        const actor = document.querySelector('#actor-select').value;

        const formFillerUrl = `/invoker/formFiller?service=${service}&actor=${actor}&fields=${emptyFields.join(',')}`;
        fetch(formFillerUrl).then(function (res) {
            res.json().then(function (json) {
                Object.keys(json).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = json[key];
                    }
                });
            });
        });
    };

    fillButton.addEventListener('click', fill);
    fillButton.addEventListener('touchstart', fill);
}).call(this);
