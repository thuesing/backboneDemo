


// Views
window.NodeListView = Backbone.View.extend({

    tagName:'ul',
    id:'node-list',

    initialize:function () {
        this.listenTo(this.model, 'reset', this.render);       
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'add', this.render);
    },

    render:function (eventName) {
//        console.log('NodeListView.render');  
        this.$el.html('');
        app.nodeList.each(function(node) {
            this.$el.append( new NodeListItemView({ model: node }).render().el );
        }, this);
        return this;
    },

    close: function () {    
           this.unbind(); // Unbind all local event bindings
           this.remove(); // Remove view from DOM    
    }

});

window.NodeListItemView = Backbone.View.extend({

    tagName:"li",

    template:_.template($('#tpl-node-list-item').html()),

    initialize:function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.render);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
      'click .add-child': 'addNodeChild',
    },  

    addNodeChild:function () {
        console.log(app.node.get('title') + " addNodeChild " + this.model.get('title'));
        //Backbone.trigger("addchildnode", this.model);
        app.node.get('childNodes').push(this.model.id);
        app.node.trigger("change");
        //console.log(app.node.get('childNodes').toString());
        app.node.save();
    },

    close: function () {    
           this.unbind(); // Unbind all local event bindings
           this.remove(); // Remove view from DOM    
    }
});
