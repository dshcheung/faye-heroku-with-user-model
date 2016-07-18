$(document).ready(function(){
  if (!$('body').hasClass('ajax')) { return false; }

  var links = {
    hideAllContent: function () {
      $('.content').hide();
    },
    bindToHome: function () {
      var that = this;
      $('.to-posts-index').on("click", function () {
        that.hideAllContent();
        $('.posts').show();
      });
    },
    bindToPostIndex: function () {
      var that = this;
      $('.to-home').on("click", function () {
        that.hideAllContent();
        $('.home').show();
      });
    },
    bindToLiveChat: function () {
      var that = this;
      $('.to-live-chat').on("click", function () {
        that.hideAllContent();
        $('.live-chat').show();
      });
    },
    init: function () {
      this.bindToHome();
      this.bindToPostIndex();
      this.bindToLiveChat();
    }
  };

  links.init();
});
