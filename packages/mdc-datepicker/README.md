# Aurelia MDC Datepicker

[![npm version](https://badge.fury.io/js/%40aurelia-toolkit%2Fmdc-datepicker.svg)](https://badge.fury.io/js/%40aurelia-toolkit%2Fmdc-datepicker)

## Installation

```
npm @aurelia-toolkit/mdc-datepicker date-fns inputmask @aurelia-toolkit/mdc-inputmask --save
```

## Configuration

```typescript
// main.ts
export function configure(aurelia: Aurelia) {
    aurelia.use.plugin(PLATFORM.moduleName('@aurelia-toolkit/mdc-datepicker'), (c: MdcDatepickerDialogConfiguration) => {
      // the dialog is localised via default options
      c.defaultOptions.i18n.dateFnsLocale = enAU;
      c.defaultOptions.firstDay = 1;
    });
    // the rest of your configuration...
}
```

```scss
// main.scss
@use "@aurelia-toolkit/mdc-datepicker";
```

## Usage

```html
<mdc-datepicker value.bind="date" format="dd/MM/yyyy" inputmask-format="dd/mm/yyyy"></mdc-datepicker>
<!-- format attribute accepts date-fns format tokens  -->
<!-- inputmask-format attribute accepts inputmask format tokens  -->
```

`mdc-datepicker` custom element uses [inputmask](https://github.com/RobinHerbots/Inputmask) to limit user's input.
You can use the datepicker dialog separately via the MDC dialog service
```ts
const dialogService: MdcDialogService;
const data: Partial<IMdcDatepickerDialogData> = {
  date: this.getDateValue(),
  options: {
    label: 'Select Date'
  }
};
const result = await dialogService.open({ viewModel: MdcDatepickerDialog, model: data });
if (result === 'ok') {
  console.log(data.date);
}
```

## Contribution

If you feel that something is missing please submit an issue or better yet a PR.
