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
    init: function () {
      this.bindToHome();
      this.bindToPostIndex();
    }
  };

  links.init();
});
