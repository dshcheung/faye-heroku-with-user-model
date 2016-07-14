$(document).ready(function(){
  if (!$('body').hasClass('ajax')) { return false; }

  var ajaxPosts = {
    getPosts: function () {
      var that = this;
      $.ajax({
        url: '/posts',
        method: 'get',
        success: function (posts) {
          $('#posts-index').html('');
          posts.forEach(function (post) {
            html = '' +
              '<div class="col-xs-4">' +
                '<a class="toggle-modal" data-id="' + post.id + '">' +
                  '<h2>' + post.title + '</h2>' +
                  '<p>' + post.content + '</p>' +
                  '<p>by: ' + post.author + '</p>' +
                '</a>' +
              '</div>';

            $('#posts-index').append(html);
          });
          that.bindShowClicks();
        }
      });
    },
    getPost: function (id, cb) {
      $.ajax({
        url: '/posts/' + id,
        method: 'get',
        success: function (post) {
          cb(post, "show");
        },
        error: function (resp) {
          console.log(resp);
        }
      });
    },
    updatePost: function (id, params, cb) {
      $.ajax({
        url: '/posts/' + id,
        method: 'put',
        data: params,
        success: function (post) {
          ajaxPosts.getPosts();
          cb(post, "edit");
        },
        error: function (resp) {
          console.log(resp);
        }
      });
    },
    createPost: function (params, cb) {
      $.ajax({
        url: '/posts',
        method: 'post',
        data: params,
        success: function (post) {
          ajaxPosts.getPosts();
          cb(post, "edit");
        },
        error: function (resp) {
          console.log(resp);
        }
      });
    },
    hideAllInModal: function () {
      var $modal = $('#post-modal');
      $modal.find('.when-show').hide();
      $modal.find('.when-edit').hide();
      $modal.find('.when-new').hide();
    },
    setPost: function (post, mode) { // on show/edit
      ajaxPosts.hideAllInModal();

      var $modal = $('#post-modal');

      if (!$.isEmptyObject(post)) {
        // set data values
        $modal.data("id", post.id);

        // set modal title and body with data
        $modal.find('.modal-title.when-show').text(post.title);
        $modal.find('.modal-body.when-show').text(post.content);
        $modal.find('.modal-title.when-edit > input').val(post.title);
        $modal.find('.modal-body.when-edit > input').val(post.content);
      }

      if (mode === "show") {
        $modal.find('.when-show').show();

        var existance = !$.isEmptyObject($.auth.user);
        if (!existance) {
          $('#post-modal-edit-btn').hide();
        }
      } else if (mode === "edit") {
        $modal.find('.when-show').show();
      } else if (mode === "new") {
        $modal.find('.when-new').show();
      }

      $modal.modal('show');
    },
    bindShowClicks: function () {
      var that = this;
      $('.toggle-modal').on('click', function (e) {
        e.preventDefault();

        var id = $(this).data('id');

        that.getPost(id, that.setPost);
      });
    },
    bindNewClick: function () {
      var that = this;
      $('#show-new-edit-model').on('click', function (e) {
        e.preventDefault();

        that.setPost(null, "new");
      });
    },
    bindModalCreateClick: function () {
      var that = this;
      $('#post-modal-create-btn').on('click', function (e) {
        e.preventDefault();

        var params = {
          post: {
            title: $('#post-modal .modal-title input').val(),
            content: $('#post-modal .modal-body input').val(),
          }
        };

        that.createPost(params, that.setPost);
      });
    },
    bindModalSaveClick: function () {
      var that = this;
      $('#post-modal-save-btn').on('click', function (e) {
        e.preventDefault();

        var id = $(this).parents('#post-modal').data("id");

        var params = {
          post: {
            title: $('#post-modal .modal-title input').val(),
            content: $('#post-modal .modal-body input').val(),
          }
        };

        that.updatePost(id, params, that.setPost);
      });
    },
    bindModalEditClick: function () {
      $('#post-modal-edit-btn').on('click', function (e) {
        e.preventDefault();

        $('#post-modal .when-edit').show();
        $('#post-modal .when-show').hide();
      });
    },
    ajaxSettings: function () {
      var token = $( 'meta[name="csrf-token"]' ).attr( 'content' );

      $.ajaxSetup( {
        beforeSend: function ( xhr ) {
          xhr.setRequestHeader( 'X-CSRF-Token', token );
        }
      });
    },
    init: function () {
      this.ajaxSettings();
      this.getPosts();
      this.bindNewClick();
      this.bindModalCreateClick();
      this.bindModalEditClick();
      this.bindModalSaveClick();
    }
  };

  ajaxPosts.init();
});
