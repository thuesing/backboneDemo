
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
