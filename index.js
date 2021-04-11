var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var images = require('metalsmith-project-images');
var collections = require('metalsmith-collections');
var ignore = require('metalsmith-ignore');
const imagemin = require('metalsmith-imagemin');
var _ = require('lodash');

function getFilesWithImages(files, imagesKey) {
  imagesKey = imagesKey || 'images';
  return _.chain(files)
    .map(function(file, index, files) {
      var obj = {}
      obj[index] = file[imagesKey];
      return obj
    })
    .filter(function(file, index, files) {
      var key = Object.keys(file)[0]
      return !_.isUndefined(file[key]);
    })
    .value()
}

var metalsmith = new Metalsmith(__dirname)
  .metadata({
    title: "Transient Sensors and the Eternal Algorithmic Composition",
    description: " ∞ blurb text by @dennis  ∞",
    url: "http://transient-sensors-and-the-eternal-algorithmic-composition.digitalmedia-bremen.de/"
  })
  .source('./src')
  .destination('./build')
  .clean(false)
  .use(ignore([
    'radio-show/*/*.wav'
 ])) //tmp: don't include sound file
  .use(images({
  	pattern: 'radio-show/**/*.md'
  }))
  .use(markdown())
  .use(collections({
    projects: {
      sortBy: 'author',
    }
  }))
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(imagemin({
    optimizationLevel: 3,
    svgoPlugins: [{ removeViewBox: false }]
  }))
  .build(function(err, files) {
    if (err) { throw err; }
    var filesWithImages = getFilesWithImages(files);
    //console.log(filesWithImages);
  });
