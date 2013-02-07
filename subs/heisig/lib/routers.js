// Generated by CoffeeScript 1.4.0
(function() {
  var Workspace, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Workspace = (function(_super) {

    __extends(Workspace, _super);

    function Workspace() {
      return Workspace.__super__.constructor.apply(this, arguments);
    }

    Workspace.prototype.routes = {
      ":query": "search"
    };

    Workspace.prototype.search = function(q) {
      q = decodeURIComponent(q);
      $('#search input').val(q);
      return deck.set('filter', q);
    };

    return Workspace;

  })(Backbone.Router);

  root = this;

  root.Workspace = Workspace;

}).call(this);