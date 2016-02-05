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
  }

  function clear(){
  cy.batch(function(){
    cy.$('.highlighted').forEach(function(n){
    n.animate({
      position: n.data('orgPos')
    });
    });
    
    cy.elements().removeClass('highlighted').removeClass('faded');
  });
  }

  function showNodeInfo( node ){
  //$('#info').html( infoTemplate( node.data() ) ).show();
  $('#info').html( infoTemplate( node.data() ) ).show();
  }

  function hideNodeInfo(){
  $('#info').hide();
  }

  function initCy( then ){
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

  var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    layout: { name: 'preset', padding: layoutPadding },
    style: styleJson,
    elements: elements,
    motionBlur: true,
    selectionType: 'single',
    boxSelectionEnabled: false,
    autoungrabify: true
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

}

