(function(board) {
  board.views = {};
  var v = board.views;
  
  v.NodeView = Backbone.View.extend({

    

  });

  v.BoardView = Backbone.View.extend({
    
    initialize: function(args) {

        this.listenTo(this.collection, 'change', this.render);
        this.stage = new Kinetic.Stage({
            container: this.el,
            width: window.innerWidth,
            height: window.innerHeight
        });

        var node_layer = new Kinetic.Layer();
        var edge_layer = new Kinetic.Layer();
        this.stage.add(edge_layer);
        this.stage.add(node_layer);

        var edge_group = new Kinetic.Group({
                x: this.stage.getWidth() / 2,
                y: this.stage.getHeight() / 2
        });

        var node_group = new Kinetic.Group({
                x: this.stage.getWidth() / 2,
                y: this.stage.getHeight() / 2
        });
        edge_layer.add(edge_group);
        node_layer.add(node_group);

        this.size = args.size || 50;
        console.log(this.size);
        this.timeout = args.timeout || 200;
        this.speed = args.speed || 125;
        var that = this;
        this.collection.each(function(item){
           var x = that.size * Math.sqrt(3) * (item.get('a') + item.get('c')/2.0);
           var y = that.size * 3/2.0 * item.get('c');
           setTimeout(function() {
               var circle = new Kinetic.Circle({
                    x: x,
                    y: y,
                    radius: 10,
                    fill: 'green'
                });

               node_group.add(circle);
               node_layer.draw();
             
           }, that.timeout);
           that.timeout += that.speed;
           _.each(item.getNeighbors(), function(neigh) {
                var nx = that.size * Math.sqrt(3) * (neigh.get('a') + neigh.get('c')/2.0);
                var ny = that.size * 3/2.0 * neigh.get('c');
                setTimeout(function() {
                var path = new Kinetic.Line({
                        points: [x, y, nx, ny],
                        stroke: 'black',
                        strokeWidth: 2
                      });
                edge_group.add(path);
                edge_layer.draw();
                }, that.timeout);
           
               that.timeout += that.speed;
           });
        });
        this.timeout = args.timeout || 200;
    },
    
    
    render: function() {
        this.stage.draw();
        return this.el;
    },
    
  });
  
})(window.board = window.board || {});
