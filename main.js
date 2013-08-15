// Models
window.Node = Backbone.Model.extend({
    //urlRoot:"../api/wines",
    defaults:{
        "id":null,
        "name":"",
        "type":"",
        "description":"",
    }
});

window.NodeCollection = Backbone.Collection.extend({
    model:Node,
    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage('bb-kohaerenz')
    // @todo REST backend
    //url:"../api/wines"
});


// Views
window.NodeListView = Backbone.View.extend({

    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (node) {
            $(self.el).append(new NodeListItemView({model:node}).render().el);
        });
    },

    render:function (eventName) {
        _.each(this.model.models, function (node) {
            $(this.el).append(new NodeListItemView({model:node}).render().el);
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
    }
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
        // change[target.name] = target.value;
        // this.model.set(change);
    },

    saveNode:function () {
        this.model.set({
            name:$('#name').val(),
            grapes:$('#grapes').val(),
            country:$('#country').val(),
            region:$('#region').val(),
            year:$('#year').val(),
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
    }

});

var app = new AppRouter();
Backbone.history.start();

