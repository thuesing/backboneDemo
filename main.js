// Models
window.Node = Backbone.Model.extend({
    //urlRoot:"../api/wines",
    // @see http://stackoverflow.com/questions/9974354/arrays-in-a-backbone-js-model-are-essentially-static
      defaults: function() { 
        return {
            "id":null,
            "title":"",
            "type":"",
            "description":"",
            "childNodes":[]
        };
      }  ,
    /*
     toString: function() {
       return "Model(" + JSON.stringify(this.attributes) + ")";
     }
     */
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

window.NodeView = Backbone.View.extend({

    template:_.template($('#tpl-node-details').html()),

    initialize:function () {
        this.listenTo(this.model, 'change', this.render);
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

    close: function () {    
           this.unbind(); // Unbind all local event bindings
           this.remove(); // Remove view from DOM    
    }
});
/**/
window.ChildListView = Backbone.View.extend({

    tagName:'ul',
    id:'node-children',

    initialize:function () {
 
        //this.listenTo(this.model, 'reset', this.render);       
        this.listenTo(this.model, 'change', this.render);
        //this.listenTo(this.model, 'add', this.render);
        // subscribe to the event aggregator's event
        //Backbone.on("addchildnode", this.addChild, this);
        //this.render;
    },
/*
    addChild:function (node) {      
        if(this.model === app.node) {
            app.node.get('childNodes').push(node.id);
            //this.model.trigger("change");
            //this.model.trigger("change:myArray");
    //        this.model.save();
    //        console.log(this.model.get('title'));
    //        console.log(node);
    //        console.log(this.model.get('childNodes'));
            this.render();
        } else {
            console.log("Achtung hier!");
        }
    },
*/
    render:function (eventName) {
        console.log('render childList: ' + JSON.stringify(this.model.get('childNodes')));    
        this.$el.empty();
        _.each(this.model.get('childNodes'), function(nodeId) {
            var node = app.nodeList.get(nodeId);          
            this.$el.append( new ChildListItemView({ model: node }).render().el );
        },this);
        return this;
    },

    close: function () {    
           this.unbind(); // Unbind all local event bindings
           this.remove(); // Remove view from DOM    
    }

});


window.ChildListItemView = Backbone.View.extend({

    tagName:'li',
    className:'single-child',

    template:_.template($('#tpl-child-list-item').html()),

    initialize:function () {
        //this.listenTo(this.model, 'change', this.render);
        //this.listenTo(this.model, 'destroy', this.render);
    },

    render:function (eventName) {
        //console.log('ChildListItemView.render');
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },


    events: {
      'click .remove-child': 'removeNodeChild'
    },  

    removeNodeChild:function () {
        console.log(app.node.get('title') + " removeNodeChild " + this.model.get('title'));
        //Backbone.trigger("addchildnode", this.model);
        app.node.set('childNodes', _.without(app.node.get('childNodes'), this.model.id));
        app.node.trigger("change");
        console.log(app.node.get('childNodes').toString());
        app.node.save();
    },    

    close: function () {    
           this.unbind(); // Unbind all local event bindings
           this.remove(); // Remove view from DOM    
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
       // if (app.nodeList) app.nodeList.close();
        this.nodeList = new NodeCollection();
        if (app.nodeListView) app.nodeListView.close();
        this.nodeListView = new NodeListView({model:this.nodeList});
        this.nodeList.fetch();
        $('#sidebar').html(this.nodeListView.render().el);
    },

    nodeDetails:function (id) {
        //console.log('#1');
        //console.log(this);
        //console.log('#2');
        
        //if (app.nodeList) app.nodeList.close();
        this.nodeList = new NodeCollection();
        this.nodeList.fetch();

        app.node = this.node = this.nodeList.get(id);
        console.log('reset node view and child list in nodeDetails');
        console.log(app.node);
        console.log(app.node.get('title') + ', child nodes: ' + JSON.stringify(app.node.get('childNodes')));

        if (app.nodeView) app.nodeView.close();
        this.nodeView = new NodeView({model:this.node});
        $('#content').html(this.nodeView.render().el);
        //console.log('#1');

        if (app.nodeListView) app.nodeListView.close();
        this.nodeListView = new NodeListView({model:this.nodeList});
        $('#sidebar').html(this.nodeListView.render().el);

        if (app.childListView) app.childListView.close();
         if (app.childListView) app.childListView.remove();
        this.childListView = new ChildListView({model:this.node});
        $('#children').html('');
        //  console.log('#2');
        $('#children').html(this.childListView.render().el);

    },

     toString: function() {
    return "Router(" + JSON.stringify(this.attributes) + ")";
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

