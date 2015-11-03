define(['config'], function(Config) {
    'use strict';
    var $loginForm = $('form[name="loginForm"]');
    var user = {
        init: function(){
            $loginForm.on('click', '#login', user.login);
        },
        login: function(){
            var formData = $('form[name="loginForm"]').serialize();
            $.post(Config.apiurl+'auth/login', formData, function(data){
                if(data.data){
                    location.href = '/'
                }else{
                    alert(data.msg);
                }
            });
            return false;
        }
    };
    user.init();

    return user; 
});
