importJavaScript('simple-jekyll-search.min');

function importJavaScript(scriptName) {
    document.write('<script type="text/javascript" src="/assets/js/' + scriptName + '.js"></script>');
}