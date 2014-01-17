(function(ctlbar, undefined) {
    var v = ctlbar.views = ctlbar.views || {};

    v.Button = Backbone.KineticView.extend({

        events: {
            'click': 'activate'
        },

        initialize: function (args) {
            this.layer = args.layer;
            this.parent = args.parent;
            this.type = args.type;
        },

        activate: function (evt) {
            evt.cancelBubble = true;
            var node = this.$el;
            if (this.anim) this.anim.stop();
            this.anim = new Kinetic.Animation(function(frame){
                    var scale = Math.abs(Math.sin(frame.time / 500)) + 0.4;
                    node.setScale(scale);
                }, this.layer);
            this.anim.start();
            this.trigger('activate', this);
            var that = this;
            this.listenToOnce(this.parent, 'button:activate', function (button) {
                if (button != that) {
                    that.deactivate();
                }
            });
        },

        deactivate: function() {
            if (this.anim) {
                this.anim.stop();
                this.$el.setScale(1);
                this.render();
            }
            this.trigger('deactivate', this);
        },

        render: function () {
            this.layer.add(this.$el);
            this.layer.draw();
            return this;
        }
    });


    v.ControlBar = Backbone.KineticView.extend({

        events: {
            'click': 'deactivateAll'
        },

        initialize: function (args) {
            var layer = this.layer = args.layer;
            var offset = args.offset || 50;
            var x = args.x || offset;
            var y = args.y || layer.getStage().getHeight() - 55;
            var width = args.width || layer.getStage().getWidth() - (offset * 2);
            var height = args.height || 50;

            var background = this.background = new Kinetic.Rect({
                x: x,
                y: y,
                width: width,
                height: height,
                fill: args.fill || 'darkgray',
                stroke: args.stroke || 'black',
                strokeWidth: 2
            });

            var triangle = this.triangle = new Kinetic.RegularPolygon({
                x: x + args.button_size + offset + 10,
                y: y + args.button_size + 12,
                sides: 3,
                radius: args.button_size + 2,
                fill: 'maroon',
                stroke: 'black',
                strokeWidth: 2
            });

            var tributton = new v.Button({type: 'triangle', parent: this, el: triangle, layer: layer});

            var circle = this.circle = new Kinetic.Circle({
                x: x + triangle.getX() + args.button_size,
                y: y + args.button_size + 6,
                radius: args.button_size - 4,
                fill: 'maroon',
                stroke: 'black',
                strokeWidth: 2
            });

            var cirbutton = new v.Button({type: 'circle', parent: this, el: circle, layer: layer});

            var square = this.square = new Kinetic.RegularPolygon({
                x: x + circle.getX() + args.button_size,
                y: y + args.button_size + 6,
                sides: 4,
                radius: args.button_size - 3,
                fill: 'maroon',
                stroke: 'black',
                strokeWidth: 2
            });

            var squbutton = new v.Button({type: 'square', parent: this, el: square, layer: layer});

            this.$el.add(background);
            this.$el.add(triangle);
            this.$el.add(circle);
            this.$el.add(square);
            layer.add(this.$el);

            var buttons = this.buttons = [tributton, cirbutton, squbutton];
            var that = this;
            _.each(buttons, function (item) {
                that.listenTo(item, 'activate', function(btn) {
                    that.trigger('button:activate', btn);
                });
                that.listenTo(item, 'deactivate', function(btn) {
                    that.trigger('button:deactivate', btn);
                });
            });

            this.render();
        },

        deactivateAll: function (evt) {
            _.each(this.buttons, function (item) {
                item.deactivate();
            });
            this.trigger('deactivate', this);
        },

        render: function () {
            this.layer.draw();
            return this;
        }

    });

})(window.ctlbar = window.ctlbar || {});
