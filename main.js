// Models
window.Node = Backbone.Model.extend({
    //urlRoot:"../api/wines",
    defaults:{
        "id":null,
        "title":"",
        "type":"",
        "description":"",
        "children":[]
    }
});

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
        this.$el.html('');
        app.nodeList.each(function(node) {
            this.$el.append( new NodeListItemView({ model: node }).render().el );
        }, this);
        return this;
    }
});

window.NodeListItemView = Backbone.View.extend({

    tagName:"li",

    template:_.template($('#tpl-node-list-item').html()),

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close:function () {
        $(this.el).unbind();
        $(this.el).remove();
    },

    events: {
      'click .add-child': 'addNodeChild'
    },  

    addNodeChild:function () {
        //console.log("NodeListItemView.addNodeChild " + this.model.get('title'));
        Backbone.trigger("addchildnode", this.model);
    }, 

});

window.NodeView = Backbone.View.extend({

    template:_.template($('#tpl-node-details').html()),

    initialize:function () {
        this.model.bind("change", this.render, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events:{
        "change input":"change",
        "click .save":"saveNode",
        "click .delete":"deleteNode"
    },

    change:function (event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
        // You could change your model on the spot, like this:
        // var change = {};
        // change[target.title] = target.value;
        // this.model.set(change);
    },

    saveNode:function () {
        this.model.set({
            title:$('#title').val(),
            type:$('#type').val(),
            description:$('#description').val()
        });
        if (this.model.isNew()) {
            app.nodeList.create(this.model);
        } else {
            this.model.save();
        }
        return false;
    },

    deleteNode:function () {
        // Destroys the model on the server by delegating an HTTP DELETE request to Backbone.sync. 
        this.model.destroy({ 
            success:function () {
                alert('Node deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    close:function () {
        $(this.el).unbind();
        $(this.el).empty();
    }
});
/**/
window.ChildListView = Backbone.View.extend({

    tagName:'ul',
    id:'node-children',

    initialize:function () {
        this.listenTo(this.model, 'reset', this.render);       
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'add', this.render);
        // subscribe to the event aggregator's event
        Backbone.on("addchildnode", this.addChild, this);
        //this.render;
    },

    addChild:function (node) {      
        console.log("ChildListView: addchildnode triggered on: " + node.get('title'));  
        this.model.get('children').push(node);
        //console.log("ChildListView: child added: " + this.model.get('children'));
        this.render();
    },

    render:function (eventName) {
          console.log('ChildListView.render');   
        this.$el.html('');
        _.each(this.model.get('children'), function(node) {
           console.log(node.get('title'));    
           this.$el.append( new ChildListItemView({ model: node }).render().el );
        },this);
        return this;
    }
});

window.ChildListItemView = Backbone.View.extend({

    tagName:'li',
    className:'single-child',

    template:_.template($('#tpl-child-list-item').html()),

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName) {
        console.log('ChildListItemView.render');
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close:function () {
        $(this.el).unbind();
        $(this.el).remove();
    }
});

window.HeaderView = Backbone.View.extend({

    template:_.template($('#tpl-header').html()),

    initialize:function () {
        this.render();
    },

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events:{
        "click .new":"newNode"
    },

    newNode:function (event) {
        if (app.nodeView) app.nodeView.close();
        app.nodeView = new NodeView({model:new Node()});
        $('#content').html(app.nodeView.render().el);
        return false;
    }
});


// Router
var AppRouter = Backbone.Router.extend({

    routes:{
        "":"list",
        "nodes/:id":"nodeDetails"
    },

    initialize:function () {
        $('#header').html(new HeaderView().render().el);
    },

    list:function () {
        this.nodeList = new NodeCollection();
        this.nodeListView = new NodeListView({model:this.nodeList});
        this.nodeList.fetch();
        $('#sidebar').html(this.nodeListView.render().el);
    },

    nodeDetails:function (id) {
        this.node = this.nodeList.get(id);

        if (app.nodeView) app.nodeView.close();
        this.nodeView = new NodeView({model:this.node});
        $('#content').html(this.nodeView.render().el);

        if (app.childListView) app.childListView.close();
        this.childListView = new ChildListView({model:this.node});
        $('#children').html(this.childListView.render().el);
    }

});

var app = new AppRouter();

Backbone.history.start();


/*
* @TODO
* child view is for all nodes the same, why?
* don't allow atach node as own child
* don#t allow doublette children
* allow detach children
*/

