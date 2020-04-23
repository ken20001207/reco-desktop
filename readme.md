## Introduction

Reco is a cross platform calendar app which focus on User Experience. Made by Yuanlin Lin.
The desktop version of Reco is made with React and package with Electron.

## Available Scripts

### `yarn build`

Build the `electron.ts` into `public/electron.js`

### `yarn dev`

Start the React application and open an electron window for development.

### `yarn dist`

Using electron builder to package the application.

## Fix Icon

If the Rsuite icon doesn't work after dist to electron app, replace this code in `rsuite-dark`

```css
@font-face {
    font-family: "rsuite-icon-font";
    src: url("https://cdnjs.cloudflare.com/ajax/libs/rsuite/4.3.4/styles/fonts/rsuite-icon-font.eot");
    src: url("https://cdnjs.cloudflare.com/ajax/libs/rsuite/4.3.4/styles/fonts/rsuite-icon-font.eot?#iefix") format("eot"), url("https://cdnjs.cloudflare.com/ajax/libs/rsuite/4.3.4/styles/fonts/rsuite-icon-font.ttf")
            format("truetype"), url("https://cdnjs.cloudflare.com/ajax/libs/rsuite/4.3.4/styles/fonts/rsuite-icon-font.woff") format("woff"),
        url("https://cdnjs.cloudflare.com/ajax/libs/rsuite/4.3.4/styles/fonts/rsuite-icon-font.svg#rsuite-icon-font") format("svg");
    font-weight: normal;
    font-style: normal;
}
```
