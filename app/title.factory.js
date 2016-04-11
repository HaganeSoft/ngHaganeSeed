angular.module('hgapp').factory('title', function($rootScope) {
    var title = 'MAS Alpha';
    return {
        title: function() { return title; },
        set: function(newTitle) {
            title = newTitle;
            $rootScope.$broadcast('titleChange');
        }
    };
})
