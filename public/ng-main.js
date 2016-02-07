/*
This demo visualises wine and cheese pairings.
*/

$(function(){
  // turn off config menus
//  $('body').toggleClass('config-closed');

  var layoutPadding = 50;
  var layoutDuration = 500;

  var graphP = loadGraphData();
  var styleP = loadStyleData();
  var infoTemplate = getInfoHandleTemplate();
/*
  var infoTemplate = Handlebars.compile([
    //'<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{toJson this}} </p>'
    '{{toJson this}}'
  ].join(''));
*/
  // when both graph export json and style loaded, init cy
  Promise.all([ graphP, styleP ]).then(initCy);
//  initCy();


  function initCy( then ){
    /*
    var loading = document.getElementById('loading');
    var expJson = then[0];

    var styleJson = then[1];
    var elements = expJson.elements;

    elements.nodes.forEach(function(n){
      var data = n.data;

      data.NodeTypeFormatted = data.NodeType;

      if( data.NodeTypeFormatted === 'RedWine' ){
      data.NodeTypeFormatted = 'Red Wine';
      } else if( data.NodeTypeFormatted === 'WhiteWine' ){
      data.NodeTypeFormatted = 'White Wine';
      }

      n.data.orgPos = {
      x: n.position.x,
      y: n.position.y
      };
    });

    loading.classList.add('loaded');


    cy = window.cy = cytoscape({
      container: document.getElementById('cy'),
      layout: { name: 'preset', padding: layoutPadding },
      style: styleJson,
      elements: elements,
      motionBlur: true,
      selectionType: 'single',
      boxSelectionEnabled: false,
      autoungrabify: true
    });
    */
    cy = window.cy = cytoscape({
      container: document.getElementById('cy'),

      style: [{"selector":"core","style":{"selection-box-color":"#AAD8FF","selection-box-border-color":"#8BB0D0","selection-box-opacity":"0.5"}},{"selector":"node","style":{"width":"mapData(score, 0, 0.006769776522008331, 20, 60)","height":"mapData(score, 0, 0.006769776522008331, 20, 60)","content":"data(name)","font-size":"12px","text-valign":"center","text-halign":"center","background-color":"#555","text-outline-color":"#555","text-outline-width":"2px","color":"#fff","overlay-padding":"6px","z-index":"10"}},{"selector":"node[?attr]","style":{"shape":"rectangle","background-color":"#aaa","text-outline-color":"#aaa","width":"16px","height":"16px","font-size":"6px","z-index":"1"}},{"selector":"node[?query]","style":{"background-clip":"none","background-fit":"contain"}},{"selector":"node:selected","style":{"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5","background-color":"#77828C","text-outline-color":"#77828C"}},{"selector":"edge","style":{"curve-style":"haystack","haystack-radius":"0.5","opacity":"0.4","line-color":"#bbb","width":"mapData(weight, 0, 1, 1, 8)","overlay-padding":"3px"}},{"selector":"node.unhighlighted","style":{"opacity":"0.2"}},{"selector":"edge.unhighlighted","style":{"opacity":"0.05"}},{"selector":".highlighted","style":{"z-index":"999999"}},{"selector":"node.highlighted","style":{"border-width":"6px","border-color":"#AAD8FF","border-opacity":"0.5","background-color":"#394855","text-outline-color":"#394855","shadow-blur":"12px","shadow-color":"#000","shadow-opacity":"0.8","shadow-offset-x":"0px","shadow-offset-y":"4px"}},{"selector":"edge.filtered","style":{"opacity":"0"}},{"selector":"edge[group=\"coexp\"]","style":{"line-color":"#d0b7d5"}},{"selector":"edge[group=\"coloc\"]","style":{"line-color":"#a0b3dc"}},{"selector":"edge[group=\"gi\"]","style":{"line-color":"#90e190"}},{"selector":"edge[group=\"path\"]","style":{"line-color":"#9bd8de"}},{"selector":"edge[group=\"pi\"]","style":{"line-color":"#eaa2a2"}},{"selector":"edge[group=\"predict\"]","style":{"line-color":"#f6c384"}},{"selector":"edge[group=\"spd\"]","style":{"line-color":"#dad4a2"}},{"selector":"edge[group=\"spd_attr\"]","style":{"line-color":"#D0D0D0"}},{"selector":"edge[group=\"reg\"]","style":{"line-color":"#D0D0D0"}},{"selector":"edge[group=\"reg_attr\"]","style":{"line-color":"#D0D0D0"}},{"selector":"edge[group=\"user\"]","style":{"line-color":"#f0ec86"}}],

      elements: [{"data":{"id":"605755","idInt":605755,"name":"PCNA","score":0.006769776522008331,"query":true,"gene":true},"position":{"x":481.0169597039117,"y":384.8210888234145},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbed":false,"grabbable":true,"classes":"fn10273 fn6944 fn9471 fn10569 fn8023 fn6956 fn6935 fn8147 fn6939 fn6936 fn6629 fn7928 fn6947 fn8612 fn6957 fn8786 fn6246 fn9367 fn6945 fn6946 fn10024 fn10022 fn6811 fn9361 fn6279 fn6278 fn8569 fn7641 fn8568 fn6943"}]
    });

    cy.on('free', 'node', function( e ){
      var n = e.cyTarget;
      var p = n.position();

      n.data('orgPos', {
      x: p.x,
      y: p.y
      });
    });

    cy.on('tap', function(){
      $('#search').blur();
    });

    cy.on('select', 'node', function(e){
      var node = this;

      highlight( node );
      showNodeInfo( node );
    });

    cy.on('unselect', 'node', function(e){
      var node = this;

      clear();
      hideNodeInfo();
    });

  } // end of initCy

<!-- insert menu.js here -->

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

  $('#search').typeahead({
    minLength: 2,
    highlight: true,
  },
  {
    name: 'search-dataset',
    source: function( query, cb ){
      function matches( str, q ){
        str = (str || '').toLowerCase();
        q = (q || '').toLowerCase();

        return str.match( q );
      }

      var fields = ['name', 'NodeType', 'Country', 'Type', 'Milk'];

      function anyFieldMatches( n ){
        for( var i = 0; i < fields.length; i++ ){
          var f = fields[i];

          if( matches( n.data(f), query ) ){
            return true;
          }
        }

        return false;
      }

      function getData(n){
        var data = n.data();

        return data;
      }

      function sortByName(n1, n2){
        if( n1.data('name') < n2.data('name') ){
          return -1;
        } else if( n1.data('name') > n2.data('name') ){
          return 1;
        }

        return 0;
      }

      var res = cy.nodes().stdFilter( anyFieldMatches ).sort( sortByName ).map( getData );

      cb( res );
    },
    templates: {
      suggestion: infoTemplate
    }
  }).on('typeahead:selected', function(e, entry, dataset){
    var n = cy.getElementById(entry.id);

    n.select();
    showNodeInfo( n );
  });

  $('#loadall').on('click', function() {
    $.ajax({
      url: 'http://192.168.93.24:8081/data',
   //   data: {},
      type: 'POST',
      success: function (data) {
        var ret = jQuery.parseJSON(data);
        alert(data);
        alert(JSON.stringify(ret.elements));
        layout.stop();
        cy.add( ret.elements);
        //if( opts.fn) {opts.fn();}
        //layout = makeLayout(opts.layoutOpts);
        var layout = cy.makeLayout({ name: 'random' });
        layout.run();
        //addToolTips();
        console.log('Success: ')
     },
     error: function (xhr, status, error) {
       alert('Error: ' + error.message);
       //$('#demo').html('Error connecting to the server-[' + error.message + ']');
     }
    });
  });

  $('#neighbour').on('click', function(){
    var eles = cy.$(':selected');
    if( !eles.empty()) {
      alert(eles.size());
    }
    else {
      alert('Please select a node');
    }
  });

  $('#reset').on('click', function(){
    cy.animate({
      fit: {
        eles: cy.elements(),
        padding: layoutPadding
      },
      duration: layoutDuration
    });
  });

  $('#filters').on('click', 'input', function(){

    var soft = $('#soft').is(':checked');
    var semiSoft = $('#semi-soft').is(':checked');
    var na = $('#na').is(':checked');
    var semiHard = $('#semi-hard').is(':checked');
    var hard = $('#hard').is(':checked');

    var red = $('#red').is(':checked');
    var white = $('#white').is(':checked');
    var cider = $('#cider').is(':checked');

    cy.batch(function(){

      cy.nodes().forEach(function( n ){
        var type = n.data('NodeType');

        n.removeClass('filtered');

        var filter = function(){
          n.addClass('filtered');
        };

        if( type === 'Cheese' ){

          var cType = n.data('Type');

          if(
               (cType === 'Soft' && !soft)
            || (cType === 'Semi-soft' && !semiSoft)
            || (cType === undefined && !na)
            || (cType === 'Semi-hard' && !semiHard)
            || (cType === 'Hard' && !hard)
          ){
            filter();
          }

        } else if( type === 'RedWine' ){

          if( !red ){ filter(); }

        } else if( type === 'WhiteWine' ){

          if( !white ){ filter(); }

        } else if( type === 'Cider' ){

          if( !cider ){ filter(); }

        }

      });

    });

  });

  $('#filter').qtip({
    position: {
      my: 'top center',
      at: 'bottom center'
    },

    show: {
      event: 'click'
    },

    hide: {
      event: 'unfocus'
    },

    style: {
      classes: 'qtip-bootstrap',
      tip: {
        width: 16,
        height: 8
      }
    },

    content: $('#filters')
  });

  $('#config-toggle').on('click', function(){
    $('body').toggleClass('config-closed');

    cy.resize();
  });

});
