/**/
window.ChildListView = Backbone.View.extend({

    tagName:'ul',
    id:'children',

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

        this.makeSortable();

        return this;
    },

    events: {
        'sortupdate #children': 'saveChildOrder'
    },

    makeSortable: function() {     
      //if (this.collection.length) { @TODO make children collection based
      if (this.model.get('childNodes').length) { // @TODO make children collection based
        // see https://github.com/farhadi/html5sortable
        // http://farhadi.ir/projects/html5sortable/
        this.$el.sortable('destroy'); // remove
        // from http://dailyjs.com/2013/04/04/backbone-tutorial-16/
        this.$el.sortable().bind('sortupdate', _.bind(this.saveChildOrder, this)); // bind again
      }
    },

    saveChildOrder: function(e, o) {

        var newChildOrder = [];
            
         _.each(this.$el.find('li'), function(id) {
            //console.log($(id).attr('childid'));
            newChildOrder.push($(id).attr('childid'));
         } ,this);
        //console.log(newChildOrder);
        //Backbone.trigger("addchildnode", this.model);
        app.node.set('childNodes', newChildOrder);
        app.node.trigger("change");
        app.node.save();
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
        this.$el.attr( "childid", this.model.id );
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
