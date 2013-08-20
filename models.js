// site/js/models/node.js

var app = app || {};

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
      }  

});