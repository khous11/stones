var stage = new Kinetic.Stage({
    container: 'movie',
    width: window.innerWidth,
    height: window.innerHeight
});

var node_layer = new Kinetic.Layer();
var edge_layer = new Kinetic.Layer();
stage.add(edge_layer);
stage.add(node_layer);

var edge_group = new Kinetic.Group({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2
});

var node_group = new Kinetic.Group({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2
});
edge_layer.add(edge_group);
node_layer.add(node_group);

var board_size = 50;
var timeout = 200;
var speed = 125;
board.examples.triangle_board.each(function(item){
   var x = board_size * Math.sqrt(3) * (item.get('a') + item.get('c')/2.0);
   var y = board_size * 3/2.0 * item.get('c');
    setTimeout(function() {
   var circle = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 10,
        fill: 'green'
    });

   node_group.add(circle);
   node_layer.draw();
 
   }, timeout);
   timeout += speed;
   _.each(item.getNeighbors(), function(neigh) {
        var nx = board_size * Math.sqrt(3) * (neigh.get('a') + neigh.get('c')/2.0);
        var ny = board_size * 3/2.0 * neigh.get('c');
        setTimeout(function() {
        var path = new Kinetic.Line({
                points: [x, y, nx, ny],
                stroke: 'black',
                strokeWidth: 2
              });
        edge_group.add(path);
        edge_layer.draw();
        }, timeout);
   
       timeout += speed;
   });
});

