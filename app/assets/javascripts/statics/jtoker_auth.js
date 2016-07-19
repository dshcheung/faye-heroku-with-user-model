$(document).ready(function(){
  if (!$('body').hasClass('ajax')) { return false; }

  var auth = {
    afterLoginAjaxCalls: function () {
      this.clearInputs();
      this.setAuthButtons();
      window.connectChat(); // from faye_chat.js
    },
    afterLogoutAjaxCall: function () {
      this.clearInputs();
      this.setAuthButtons();
      window.disconnectChat(); // from faye_chat.js
    },
    setAuthButtons: function () {
      var existance = !$.isEmptyObject($.auth.user);

      if (existance) {
        $('#logout').show();
        $('#login').hide();
        $('#signup').hide();
        $('#posts-new-btn').show();
        $('#post-modal-edit-btn').show();
        $('#login-modal').modal('hide');
        $('#signup-modal').modal('hide');
        $('.to-live-chat').show();
      } else {
        $('#logout').hide();
        $('#login').show();
        $('#signup').show();
        $('#posts-new-btn').hide();
        $('#post-modal-edit-btn').hide();
        $('.to-live-chat').hide();
      }
    },
    bindLogOutClick: function () {
      var that = this;

      $('#logout').on('click', function (e) {
        e.preventDefault();
        $.auth.signOut().then(function(resp){
          that.afterLogoutAjaxCall();
        }).fail(function(resp){
          that.afterLogoutAjaxCall();
        });
      });
    },
    bindLogInClick: function () {
      var that = this;

      var cb = function (e) {
        e.preventDefault();

        var params = {
          email: $('#login-modal #login-form input[name="email"]').val(),
          password: $('#login-modal #login-form input[name="password"]').val()
        };

        $.auth.emailSignIn(params).then(function(resp){
          that.afterLoginAjaxCalls();
        }).fail(function(resp){
          console.log(resp);
        });
      };

      $('#login').on('click', function (e) {
        e.preventDefault();

        $('#login-modal').modal('show');
      });
      $('#login-modal #login-btn').on('click', cb);
      $('#login-modal #login-form').on('submit', cb);
    },
    bindSignUpClick: function () {
      var that = this;

      var cb = function (e) {
        e.preventDefault();

        var params = {
          email: $('#signup-modal #signup-form input[name="email"]').val(),
          password: $('#signup-modal #signup-form input[name="password"]').val(),
          password_confirmation: $('#signup-modal #signup-form input[name="password_confirmation"]').val()
        };

        $.auth.emailSignUp(params).then(function(user){
          that.afterLoginAjaxCalls();
        }).fail(function(resp){
          console.log(resp);
        });
      };

      $('#signup').on('click', function (e) {
        e.preventDefault();

        $('#signup-modal').modal('show');
      });
      $('#signup-modal #signup-btn').on('click', cb);
      $('#signup-modal #signup-form').on('submit', cb);
    },
    clearInputs: function () {
      $('#login-modal #login-form input[name="email"]').val('');
      $('#login-modal #login-form input[name="password"]').val('');
      $('#signup-modal #signup-form input[name="email"]').val('');
      $('#signup-modal #signup-form input[name="password"]').val('');
      $('#signup-modal #signup-form input[name="password_confirmation"]').val('');
    },
    authSettings: function () {
      var that = this;

      $.auth.configure({
        // By default, you only need to configure apiUrl
        // Note that if you put a '/' at the end of the link, there will be errors when calling the api
        apiUrl: location.origin
      }).then(function(resp){
        that.afterLoginAjaxCalls();
      }).fail(function(resp){
        console.log(resp);
        that.afterLogoutAjaxCall();
      });
    },
    init: function () {
      this.authSettings();
      this.bindLogOutClick();
      this.bindLogInClick();
      this.bindSignUpClick();
    }
  };

  auth.init();
});
