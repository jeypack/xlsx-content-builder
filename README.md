# [xlsx](https://sheetjs.com/)-content-builder

## EG+ XLSX Content Builder: 2.0.0
>A product template tool based on `sheetjs`, `nunjucks` and the `juiced` library with responsive `flexbox slider` section.

[Author](joerg.pfeifer@geplusww.com) Jörg Pfeifer

### `Installation`

Make shure you have installed the latest version of git, node and npm.\
Node v18.6.0 allready contains npx and npm.

```js
node -v //v18.6.0
npm -v //8.13.2
npx -v //8.13.2

//check for gulp and CLI
gulp -v //CLI version: 2.3.0 Local version: 4.0.2
```

If not, you have to install the CLI global - `you have to have admin rights`.

```js
npm install --global gulp-cli
```

Clone the repository or download .zip, extract to a folder named `xlsx-content-builder` and run `npm install` inside folder.\
It will install all node modules defined inside package.json.

```js
npm install
```

### `Getting Started with XLSX Content Builder`

XLSX content builder takes multiple
Alter the TEMPLATES array inside gulpfile.js/alza-template.js to match the correct template folder naming.
Change images and cols inside container and|or remove to your need.

#
### `gulp tasks and deployment`

In the project directory, you can run:

```js
gulp
```


Runs the current template in the development mode.\
The page will reload if you make edits.

### `gulp dev`

Builds all templates for development to the `_temp_` folder.\
Creates a `zip` folder inside `_temp_` with all content zipped.

```js
gulp dev
```

### `gulp build`

Builds all templates for production to the `_build` folder.\
It correctly bundles Flexslider in production mode and optimizes the build for the best performance.\
Also creates a `zip` folder inside `_temp_` with all content zipped.\
The build is minified and the filenames include the hashes.

```js
gulp build
```

### `gulp zip`

Creates a `zip` folder inside `_temp_` and `_build` folder, if published content exists inside these folders.

```js
gulp zip
```

### `Deployment`

This section has to be added.

## Live Version

This section has to be added. [clients](https://online.e-graphics-germany.de/clients/?user=egp) and choose your favorite. ;)

## How It Works

todo


[© EG+ 2017 - 2022](https://www.egplusww.de)
