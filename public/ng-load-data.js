
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

function highlight( node ){
  var nhood = node.closedNeighborhood();

  cy.batch(function(){
    cy.elements().not( nhood ).removeClass('highlighted').addClass('faded');
    nhood.removeClass('faded').addClass('highlighted');
    
    var npos = node.position();
    var w = window.innerWidth;
    var h = window.innerHeight;
    
    cy.stop().animate({
    fit: {
      eles: cy.elements(),
      padding: layoutPadding
    }
    }, {
    duration: layoutDuration
    }).delay( layoutDuration, function(){
    nhood.layout({
      name: 'concentric',
      padding: layoutPadding,
      animate: true,
      animationDuration: layoutDuration,
      boundingBox: {
      x1: npos.x - w/2,
      x2: npos.x + w/2,
      y1: npos.y - w/2,
      y2: npos.y + w/2
      },
      fit: true,
      concentric: function( n ){
      if( node.id() === n.id() ){
        return 2;
      } else {
        return 1;
      }
      },
      levelWidth: function(){
      return 1;
      }
    });
    } );
    
  });
} // end highlight

function clear(){
  cy.batch(function(){
    cy.$('.highlighted').forEach(function(n){
    n.animate({
      position: n.data('orgPos')
    });
    });
    
    cy.elements().removeClass('highlighted').removeClass('faded');
  });
} // end clear

function showNodeInfo( node ){
//$('#info').html( infoTemplate( node.data() ) ).show();
  $('#info').html( infoTemplate( node.data() ) ).show();
}// end showNodeInfo

function hideNodeInfo(){
  $('#info').hide();
}// end hideNodeInfo



