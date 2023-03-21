# [xlsx](https://www.npmjs.com/package/xlsx)-content-builder

## EG+ XLSX Content Builder: 2.2.1
>A product template tool based on [`sheetjs`](https://sheetjs.com/), [`nunjucks`](https://www.npmjs.com/package/nunjucks) and the [`juiced`](http://juicedcss.com/) library with responsive `flexbox slider` section.

[Author](joerg.pfeifer@geplusww.com) Jörg Pfeifer 22.07.2022

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

With the 'XLSX-CONTENT-BUILDER' several Excel files with different languages can be applied to one template. The output then consists of one folder for each language and/or version. Multiple versions can be created for each template and language.\
``TPL_NAMES`` is a multidimensional array with one array each for ``BRAND``, ``PRODUCT``, ``TYPE``, ``LANGUAGE``, ``VERSION``, ``FLEX_COLS``, ``CLIENT_VERSION``, ``BODY_CLASS``, ``XLSX_PARSER`` and ``DATE``. These properties and their use are explained in detail below.\
Each array within TPL_NAMES must have exactly the same number of entries.
A build starts from a certain position, which is determined by these 3 variables: ``CURRENT``, ``CURRENT_LANGUAGE`` and ``CURRENT_VERSION`` - corresponding entries must be present!\
With each iteration (triggered by the ``next`` function), these variables are incremented according to the following logic:\
``CURRENT`` remains until all languages ​​and versions have been created.
Let's take the following situation as an example:

```js
TPL_NAMES: {
    BRAND: ["OralB", "OralB"],
    PRODUCT: ["Genesis5", "Genesis5"],
    TYPE: [ "Pro-3", "KIDS-Lightyear"],
    LANGUAGE: [
      ["CZ", "HU", "PL", "SK"],
      ["CZ", "HU", "PL", "SK"],
    ],
    //every language may have more than 1 version
    //here we keep version length for every language entry
    //e.g. TPL_NAMES.VERSION[CURRENT_LANGUAGE] = 1 means one version ...
    VERSION: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
    FLEX_COLS: [
      [3, 3, 3, 3],
      [3, 3, 3, 3],
    ],
    CLIENT_VERSION: ["V01", "V01"],
    BODY_CLASS: [
      ["mobile", "mobile", "mobile", "mobile"],
      ["mobile", "mobile", "mobile", "mobile"],
    ],
    XLSX_PARSER: [
      XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_4,
      XLSX_TYPE_ENUM.P_1_4_4_1_FLEX_3,
    ],
    DATE: ["220626", "220626"],
    SIZE: "1195xAUTO",
    PREFIX: "HTML5",
    SUFFIX: "",
  },
  //
  CURRENT: 0,
  CURRENT_LANGUAGE: 0,
  CURRENT_VERSION: 0,
  CURRENT_TPL_VERSION: "LANG",
```

``CURRENT_TPL_VERSION`` controls the name structure. Default is ``TPL_ENUM.LANG``, which means that for each language there is a template folder inside the ``src/xlsx-template`` folder with images, css and javascript. There is also a matching .xlsx file within the ``xlsx`` folder with the following naming convention: ``BRAND_PRODUCT_TYPE_LANGUAGE_VERSION_DATE``. This allows all cases to be mapped.\
It is possible to use a different XLSX parser for each template.\
The XLSX parser is currently controlled via the following enums.

```js
//to be continued...
const XLSX_TYPE_ENUM = {
  P_1_4_4_1_FLEX_3: "PARSER-1-4-4-1-FLEX-3",
  P_1_4_4_1_FLEX_4: "PARSER-1-4-4-1-FLEX-4",
  P_1_3_3_1_FLEX_4: "PARSER-1-3-3-1-FLEX-4",
  P_1_1_4_4_FLEX_6: "PARSER-1-1-4-4-FLEX-6",
};
```

The VERSION property or array is special and has a corresponding version length ready for each language - 1 means 1 version per language, 2 corresponds to 2 different versions per language.

#
### `gulp tasks and deployment`

In the project directory, you can run to watch current config:

```js
gulp
```

Start by creating images out of existing folder inside `src/xlsx-template/_images`.


```js
gulp images
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

## How It Works

todo


[© EG+ 2017 - 2023](https://www.egplusww.de)
