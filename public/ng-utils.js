
  // get exported json from cytoscape desktop via ajax
function loadGraphData() {
  return $.ajax({
    url: 'https://cdn.rawgit.com/maxkfranz/3d4d3c8eb808bd95bae7/raw', // wine-and-cheese.json
    type: 'GET',
    dataType: 'json'
  });
} // end loadGraphData

function loadStyleData() {
  // also get style via ajax
  return $.ajax({
    url: 'https://cdn.rawgit.com/maxkfranz/9210c03a591f8736b82d/raw', // wine-and-cheese-style.cycss
    type: 'GET',
    dataType: 'text'
  });
} // end loadStyleData

function registerFuncs() {
  Handlebars.registerHelper('toJson', function(data){
    var str='';
    for (var key in data ) {
      str += '<p class="ac-node-type"><i class="fa fa-info-circle"></i> ' + key + ': ' + data.key + '</p>'
    }
    return str;
  });

  Handlebars.registerHelper('joinstr', function(items){
    //return items.join('|');
    return 'AAbb';
  });

} // end registerFuncs

function getInfoHandleTemplate() {
  return Handlebars.compile([
    '<p class="ac-name">[{{id}}]{{name}}</p>',
    '<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{#if labels}}{{labels}}{{/if}}</p>',
    '{{#if Person}}<p class="ac-milk"><i class="fa fa-angle-double-right"></i> {{born}}</p>{{/if}}',
    '{{#if Movie}}<p class="ac-country"><i class="fa fa-map-marker"></i> {{released}}</p>{{/if}}',
    '<p class="ac-more"><i class="fa fa-external-link"></i> <a target="_blank" href="http://google.com/search?q={{name}}">More information</a></p>'
  ].join(''));
} // end getInfoHandleTemplate
