

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

