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
          this.setElement(new Kinetic.Circle({
              radius: this.parent.node_size / 4,
              stroke: 'darkgray',
              strokeWidth: 2
          }));
          this.$el.setX(this.x);
          this.$el.setY(this.y);
          this.listenTo(this.model, 'change', this.render);
          this.listenTo(this.model, 'change:active', this.deactivate);
          this.listenTo(this.model, 'change:type', this.setType);
          this.render();
      },

      render: function() {
           if (!this.model.get('owner')) this.$el.setFill('black');
           else this.$el.setFill(this.model.get('owner').get('color'));
           this.parent.node_group.add(this.$el);
           this.parent.node_layer.draw();
           return this;
      },

      setType: function (model, value, opts) {
        this.$el.hide();
        if (value == 'triangle') {
          this.setElement(new Kinetic.RegularPolygon({
              sides: 3,
              radius: this.parent.node_size / 3,
              stroke: 'darkgray',
              strokeWidth: 2
          }));
        } else if (value == 'circle') {
          this.setElement(new Kinetic.Circle({
              radius: this.parent.node_size / 4,
              stroke: 'darkgray',
              strokeWidth: 2
          }));
        } else if (value == 'square') {
          this.setElement(new Kinetic.RegularPolygon({
              sides: 4,
              radius: this.parent.node_size / 3,
              stroke: 'darkgray',
              strokeWidth: 2
          }));
        } else {
            throw 'recieved bad type ' + value;
        }
          this.$el.setX(this.x);
          this.$el.setY(this.y);
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
        if (this.model.get('active')) {
            this.anim.start();
        }
      },

      deactivate: function(model, value, opts) {
        if (!value && this.anim) this.anim.stop();
        this.$el.setScale(1);
      }
  });

  v.BoardView = Backbone.KineticView.extend({

    events: {
        'click': 'deactivateAll'
    },

    initialize: function(args) {
        var stage = this.stage = args.stage;
        var node_size = this.node_size = args.node_size;
        var width = args.width || stage.getWidth();
        var height = args.height || stage.getHeight();
        var edge_layer = this.edge_layer = new Kinetic.Layer();
        var node_layer = this.node_layer = new Kinetic.Layer();
        stage.add(edge_layer);
        stage.add(node_layer);

        var edge_group = this.edge_group = new Kinetic.Group({
                x: width / 2,
                y: height / 3
        });

        var node_group = this.node_group = new Kinetic.Group({
                x: width / 2,
                y: height / 3
        });

        var background = this.background = new Kinetic.Rect({
            x: args.x || 0,
            y: args.y || 0,
            width: width,
            height:height,
            fill: 'darkgreen',
            stroke: 'black',
            strokeWidth: 2
        });


        var pedistal = this.pedistal =  new Kinetic.Rect({
            x: args.x + 5 || 5,
            y: args.y + 5 || 5,
            width: width - 10,
            height:height - 10,
            fill: '#EEF3E2',
            stroke: 'grey',
            strokeWidth: 2
        });

        edge_layer.add(background);
        edge_layer.add(pedistal);
        edge_layer.add(edge_group);
        node_layer.add(node_group);

        var that = this;
        this.collection.each(function(item){
            var x = item.getX(node_size);
            var y = item.getY(node_size);
            new v.NodeView({model: item, parent: that, x: x, y: y});
            _.each(item.getNeighbors(), function(neigh) {
                var nx = neigh.getX(node_size);
                var ny = neigh.getY(node_size);
                var path = new Kinetic.Line({
                    points: [x, y, nx, ny],
                    stroke: 'black',
                    strokeWidth: 2
                });
                edge_group.add(path);
                edge_layer.draw();
           });
        });

        this.setElement(stage);

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
        this.trigger('deactivateAll');
    }
  });

})(window.board = window.board || {});
