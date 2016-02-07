
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
      //if (data.hasOwnProperty(key)) {
      str += '<p class="ac-node-type"><i class="fa fa-info-circle"></i> ' + key + ': ' + data.key + '</p>'
        //str =  str +  key //+ ': '+ data.key 
      //}
    }

    return str; //JSON.stringify(obj ); //str;
  });
} // end registerFuncs

function getInfoHandleTemplate() {
  return Handlebars.compile([
    '<p class="ac-name">[{{id}}]{{name}}</p>',
    '<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{NodeTypeFormatted}} {{#if Type}}({{Type}}){{/if}}</p>',
    '{{#if Milk}}<p class="ac-milk"><i class="fa fa-angle-double-right"></i> {{Milk}}</p>{{/if}}',
    '{{#if Country}}<p class="ac-country"><i class="fa fa-map-marker"></i> {{Country}}</p>{{/if}}',
    '<p class="ac-more"><i class="fa fa-external-link"></i> <a target="_blank" href="http://google.com/search?q={{name}}">More information</a></p>'
  ].join(''));
} // end getInfoHandleTemplate




