

window.NodeCollection = Backbone.Collection.extend({
    model:Node,
    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage('bb-kohaerenz'),
    // @todo REST backend
    //url:"../api/wines"
    comparator: function(node) {
        return node.get('title');
    }
});