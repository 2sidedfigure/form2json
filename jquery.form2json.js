(function($) {
    
    var defaults = {
            inputSelectors: 'input:not([type=radio], [type=checkbox], [type=reset]), input[type=checkbox], input[type=radio]:checked, textarea, select',
            multiValSelector: '[type=checkbox], select',
            keyAttr: 'name',
            wrapped: false,
            allowEmptyMultiVal: false,
            allowEmptySingleVal: true
        },
        settings = {},
        // borrow isEmpty from underscore to prevent a hard dependency
        // http://documentcloud.github.com/underscore
        empty = function(obj) {
            //if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
            if (obj && obj.length) return obj.length === 0;
            for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
            return true;
        };
    
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
                key = item.attr(settings.keyAttr) || item.attr('name') || item.attr('id'),
                val = item.val();
            
            if (!settings.allowEmptySingleVal && empty(val)) return true;
            (key) && (data[key] = val);
        });
        
        multiVal.each(function() {
            var item = $(this),
                key = item.attr(settings.keyAttr) || item.attr('name') || item.attr('id'),
                val = item.is(':checkbox:not(:checked)') ? null : item.val();
            
            if (key && (val || settings.allowEmptyMultiVal)) {
                if (data[key]) {
                    if (val) {
                        //already exists, but needs to be turned into an array
                        $.isArray(data[key]) || (data[key] = [ data[key] ]);
                        
                        data[key].push(val);
                    }
                } else {
                    //data doesn't have the item yet, create it
                    data[key] = val;
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
