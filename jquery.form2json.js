(function($) {
    
    var defaults = {
            inputSelectors: 'input:not([type=radio], [type=checkbox], [type=reset]), input[type=checkbox]:checked, input[type=radio]:checked, textarea, select',
            multiValSelector: '[type=checkbox], select',
            keyAttr: 'name',
            wrapped: false
        },
        settings = {};
    
    $.fn.form2json = function(options) {
        var form = $(this);
        
        if (!form.is('form')) {
            return;
        }
        
        settings = $.extend(true, {}, defaults, options);
        
        var data = {},
            fields = form.find(settings.inputSelectors),
            singleVal = fields.filter(':not(' + settings.multiValSelector + ')'),
            multiVal = fields.filter(settings.multiValSelector);
            
        singleVal.each(function() {
            var item = $(this),
                key = item.attr(settings.keyAttr) || item.attr('name') || item.attr('id');
            
            key && (data[key] = item.val());
        });
        
        multiVal.each(function() {
            var item = $(this),
                key = item.attr(settings.keyAttr) || item.attr('name') || item.attr('id');
            
            if (key) {
                if (data[key]) {
                    //already exists, but needs to be turned into an array
                    $.isArray(data[key]) || (data[key] = [ data[key] ]);
                    
                    data[key].push(item.val());
                } else {
                    //data doesn't have the item yet, create it
                    data[key] = item.val();
                }
            }
        });
        
        if (!settings.wrapped) {
            return data;
        }
        
        var ajax = { data: data },
            method = form.attr('method'),
            action = form.attr('action');
            
        (method && method.toUpperCase() != 'GET') && (ajax.type = method);
        (action) && (ajax.url = action);
        
        return ajax;
    };
    
})(jQuery);
