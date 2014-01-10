(function(board) {
  board.views = {};
  var v = board.views;
 
  v.NodeView = Backbone.KineticView.extend({

      events: {
        'click': 'activate'
      },

      initialize: function (args) {
          this.parent = args.parent;
          this.x = args.x;
          this.y = args.y;
          this.$el.setX(this.x);
          this.$el.setY(this.y);
          this.listenTo(this.model, 'change', this.render);
          this.listenTo(this.model, 'change:active', this.deactivate);
          this.render();
      },
 
      el: function() {
        return new Kinetic.Circle({radius: 12});
      },

      render: function() {
           if (!this.model.get('owner')) this.$el.setFill('black');
           else this.$el.setFill(this.model.get('owner').get('color'));
           this.parent.node_group.add(this.$el);
           this.parent.node_layer.draw();
           return this;
      },

      activate: function (evt) {
        this.model.activate();
        evt.cancelBubble = true;
        var node = this.$el;
        if (this.anim) this.anim.stop(); 
        this.anim = new Kinetic.Animation(function(frame){
                var scale = Math.abs(Math.sin(frame.time / 500)) + 0.4;
                node.setScale(scale); 
            }, this.parent.node_layer);
        this.anim.start();
      },

      deactivate: function(model, value, opts) {
        if (!value) this.anim.stop();
        this.$el.setScale(1);
      }
  });

  v.BoardView = Backbone.KineticView.extend({
 
    events: {
        'click': 'deactivateAll'
    },

    initialize: function(args) {

        this.listenTo(this.collection, 'change', this.render);
        this.stage = new Kinetic.Stage({
            container: args.container,
            width: args.width,
            height: args.height,
            fill: 'orange' 
        });

        this.node_layer = new Kinetic.Layer();
        var edge_layer = new Kinetic.Layer();
        this.stage.add(edge_layer);
        this.stage.add(this.node_layer);

        var edge_group = new Kinetic.Group({
                x: this.stage.getWidth() / 2,
                y: this.stage.getHeight() / 2
        });

        this.node_group = new Kinetic.Group({
                x: this.stage.getWidth() / 2,
                y: this.stage.getHeight() / 2
        });

        var background = new Kinetic.Rect({
            x: this.stage.getX(),
            y: this.stage.getY() + 100,
            width: this.stage.getWidth(),
            height: this.stage.getHeight() - 125,
            fill: '#EEF3E2',
            stroke: 'grey',
            strokeWidth: 3
        });
        edge_layer.add(background);
        edge_layer.add(edge_group);
        this.node_layer.add(this.node_group);

        this.size = args.size || 50;
        this.timeout = args.timeout || 200;
        this.speed = args.speed || 125;
        var that = this;
        this.collection.each(function(item){
           var x = that.size * Math.sqrt(3) * (item.get('a') + item.get('c')/2.0);
           var y = that.size * 3/2.0 * item.get('c');
           setTimeout(function() {
               new v.NodeView({model: item, parent: that, x: x, y: y});
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
        this.setElement(this.stage);
    },
 
    render: function() {
        this.stage.draw();
        return this;
    },
    
    deactivateAll: function(evt) {
        var active = this.collection.where({'active': true}); 
        _.each(active, function(item){ item.deactivate(); });
    }
  });
 
})(window.board = window.board || {});
