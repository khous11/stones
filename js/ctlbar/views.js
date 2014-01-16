(function(ctlbar, undefined) {
    var v = ctlbar.views = ctlbar.views || {};
    
    v.ControlBarView = Backbone.KineticView.extend({
        
        initialize: function (args) {
            var layer = this.layer = args.layer;
            var offset = args.offset || 50;
            var x = args.x || offset;
            var y = args.y || layer.getHeight() - 100;
            var width = args.width || layer.getWidth() - offset;
            var height = args.height || 100;

            var background = this.background = new Kinetic.Rect({
                x: x,
                y: y,
                width: width,
                height: height,
                fill: args.fill || 'darkgray',
                stroke: args.stroke || 'black',
                strokeWidth: 2
            });
            
            this.$el.add(background);


            layer.add(this.$el);

        },

        render: function () {
            this.layer.draw();
            return this;
        }
    
    });

})(window.ctlbar = window.ctlbar || {});
