require([
    "splunkjs/ready!",
    "splunkjs/mvc/searchmanager",
    "underscore",
    "jquery"
], function(mvc, searchManager, _, $) {
    var registry = mvc.Components;
    
    var updateTitle = function(manager, data) {
        if ( !data || !data.results || !data.results.length) {
            return;
        }
    
        var topprocess = data.results[0];
        
        $("[data-panel-ref=cputime] .panel-head h3")
            .text("Longest Running Process: " + topprocess["Process"] + 
                  " (" + topprocess["CPU Time"] + ")");
    };
    
    var setUpSearchListener = function(searchname) {
        var searchmanager = registry.getInstance(searchname);
        var resultmanager = searchmanager.data("preview", {
            output_mode: "json",
            count: 1,
            offset: 0
        });
        resultmanager.on("data", updateTitle);
    };
    
    var findPanel = function() {
        var panel = _.filter(registry.getInstanceNames(), 
                             function(name) { return name.match(/panel\d+_cputimesearch/); });
        if (panel.length === 1) {
            registry.off('change', findPanel);
            setUpSearchListener(panel[0]);
        }
    };
    
    var handle = registry.on('change', findPanel);
});
