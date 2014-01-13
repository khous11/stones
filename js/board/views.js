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
        var stage = this.stage = args.stage;
        var edge_layer = this.edge_layer = new Kinetic.Layer();
        var node_layer = this.node_layer = new Kinetic.Layer();
        stage.add(edge_layer);
        stage.add(node_layer);

        //TODO these should be centered to board not stage
        var edge_group = this.edge_group = new Kinetic.Group({
                x: stage.getWidth() / 2,
                y: stage.getHeight() / 2
        });

        var node_group = this.node_group = new Kinetic.Group({
                x: stage.getWidth() / 2,
                y: stage.getHeight() / 2
        });

        var background = this.background = new Kinetic.Rect({
            x: args.x || 0,
            y: args.y || 0,
            width: args.width || stage.getWidth(),
            height: args.height || stage.getHeight(),
            fill: '#EEF3E2',
            stroke: 'grey',
            strokeWidth: 2
        });
        edge_layer.add(background);
        edge_layer.add(edge_group);
        node_layer.add(node_group);
        
        var that = this;
        this.collection.each(function(item){
            var x = item.getX(args.node_size);
            var y = item.getY(args.node_size);
            new v.NodeView({model: item, parent: that, x: x, y: y});
            _.each(item.getNeighbors(), function(neigh) {
                var nx = neigh.getX(args.node_size);
                var ny = neigh.getY(args.node_size);
                var path = new Kinetic.Line({
                    points: [x, y, nx, ny],
                    stroke: 'black',
                    strokeWidth: 2
                });
                edge_group.add(path);
                edge_layer.draw();
           });
        });

        this.setElement(args.stage);

        // add listeners
        this.listenTo(this.collection, 'change', this.render);
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
