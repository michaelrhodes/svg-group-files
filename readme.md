# svg-group-files (`grf`)

svg-group-files is command-line application that takes an SVG file with multiple <g> elements and splits them into their own files. Its primary use is converting the output of Illustrator’s SaveDocsAsSVG script.

## install
```sh
$ npm install -g michaelrhodes/svg-group-files
```

## usage
```sh
$ grf <path-to-svg>
```
Each group will be saved in the working directory with the name of its [slugified](https://github.com/ianstormtaylor/to-slug-case) id attribute (ie. the layer name).
