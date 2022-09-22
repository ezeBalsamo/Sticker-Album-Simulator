export default class FormBuilder{
    constructor() {
        this.form = document.createElement("form");
        this.hasSubmitButton = false;
        this.hasListenerOnSubmit = false;
    }

    append(htmlElement){
        this.form.appendChild(htmlElement);
        return this;
    }

    addNumericInputLabeled(labelText){
        const label = document.createElement("label");
        label.setAttribute("for", labelText);
        label.innerText = labelText;

        const input = document.createElement("input");
        input.setAttribute("id", labelText);
        input.setAttribute("name", labelText);
        input.setAttribute("type", "number");

        this.append(label).append(input);
        return this;
    }

    addSubmitButton(){
        const submitButton = document.createElement("button");
        submitButton.setAttribute("type", "submit");
        submitButton.innerText = 'Submit';
        this.append(submitButton);
        return this;
    }

    onSubmitDo(callback){
        this.hasListenerOnSubmit = true;
        this.form.onsubmit = callback;
        return this;
    }

    withDataFromSubmitDo(callback){
        this.onSubmitDo(event => {
            event.preventDefault();
            callback(Object.fromEntries(new FormData(event.target)));
        });
        return this;
    }

    build(){
        if (this.hasListenerOnSubmit && !this.hasSubmitButton){
            this.addSubmitButton();
        }
        return this.form;
    }
}