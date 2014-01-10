(function(board, undefined) {
board.models = {};
var m = board.models;

m.Node = Backbone.Model.extend({

  getNeighbors: function() {
    // TODO: reimplement this when server is written
    var n_ids = this.get('neighbors');
    var neighbors = [];
    for (var ind in n_ids) {
      var n_id = n_ids[ind];
      var node = this.collection.getNode(n_id.a, n_id.b, n_id.c);
      if (node) {
        neighbors.push(node);
      }
    }
    return neighbors;
  },

  isNeighbor: function(a, b, c) {
    throw "not implemented"; //probably implement with jquery inArray
  },

  activate: function () {
    this.set('active', true);
    this.listenToOnce(
            this.collection,
            'change:active',
            this.deactivate
        );
  },

  deactivate: function(model, opts) {
    this.set('active', false);
  }
});

m.Board = Backbone.Collection.extend({

  model: m.Node,
  nodes: [],
  localStorage: new Backbone.LocalStorage("stones"),

  initialize: function (args, opts) {
    this.listenTo(this, 'add', this.addNode);
    this.listenTo(this, 'remove', this.removeNode);

  },

  getNode: function(a, b, c) {
    try {
      return this.nodes[a][b][c];
    } catch (TypeError) {
      return undefined;
    }
  },

  addNode: function(n) {
      nodes = this._prepNodes(n);
      nodes[n.get('a')][n.get('b')][n.get('c')] = n;
  },

  removeNode: function(n) {
      nodes = this._prepNodes(n);
      nodes[n.get('a')][n.get('b')][n.get('c')] = undefined;
  },

  _prepNodes: function(n) {
      nodes = this.nodes;
      nodes[n.get('a')] = nodes[n.get('a')] || [];
      nodes[n.get('a')][n.get('b')] = nodes[n.get('a')][n.get('b')] || [];
      return nodes;
  }

});

var examples = board.examples || {};


examples.triangle_board = new m.Board();
examples.triangle_board.add([ // call add to make sure our listeners are called
                          {a: 0, b: 0, c: 0, 
                          neighbors: [
                              {a: -1, b: 0, c: 1},
                              {a: 1, b: -1, c: 0},
                              {a: 0, b: 1, c: -1}
                                                 ]},
                          {a: -1, b: 0, c: 1,
                             neighbors: [
                                          {a: 0, b: 0, c: 0},
                                          {a: 0, b: -1, c: 1},
                                          {a: -1, b: -1, c: 2},
                                          {a: -1, b: 1, c: 0}
                                                              ]},
                          {a: 1, b: -1, c: 0,
                             neighbors: [
                                          {a: 0, b: 0, c: 0},
                                          {a: 2, b: -1, c: -1},
                                          {a: 1, b: 0, c: -1},
                                          {a: 0, b: -1, c: 1}

                                                              ]},
                          {a: 0, b: 1, c: -1,
                             neighbors: [
                                          {a: 0, b: 0, c: 0},
                                          {a: -1, b: 2, c: -1},
                                          {a: -1, b: 1, c: 0},
                                          {a: 1, b: 0, c: -1}
                                                              ]},

                          {a: -1, b: 2, c: -1,
                             neighbors: [
                                          {a: -1, b: 1, c: 0},
                                          {a: 0, b: 1, c: -1}
                                                              ]},

                          {a: -1, b: 1, c: 0,
                                 neighbors: [
                                          {a: -1, b: 2, c: -1},
                                          {a: -1, b: 0, c: 1},
                                          {a: 0, b: 1, c: -1}
                                                              ]},
                          {a: -1, b: -1, c: 2,
                              neighbors: [
                                          {a: -1, b: 0, c: 1},
                                          {a: 0, b: -1, c: 1}
                                                              ]},
                          {a: 0, b: -1, c: 1,
                              neighbors: [
                                          {a: -1, b: -1, c: 2},
                                          {a: 1, b: -1, c: 0},
                                          {a: -1, b: 0, c: 1}
                                                              ]},
                          {a: 1, b: 0, c: -1,
                              neighbors: [
                                          {a: 2, b: -1, c: -1},
                                          {a: 1, b: 1, c: 0},
                                          {a: 0, b: 1, c: -1}
                                                              ]},
                          {a: 2, b: -1, c: -1,
                                 neighbors: [
                                          {a: 1, b: -1, c: 0},
                                          {a: 1, b: 0, c: -1}
                                                              ]},
                        ]);

board.examples = examples;
})(window.board = window.board || {});










