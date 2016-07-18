window.client = new Faye.Client('/faye');

var bindClientIDWithUser = {
  outgoing: function(message, callback) {
    console.log('outgoing', message);
    if (!this.connected && message.clientId && message.channel === "/meta/connect") {
      this.connected = true;

      $.ajax({
        url: '/bind_user',
        method: 'post',
        data: {
          client_id: message.clientId
        },
        success: function (resp) {
          console.log("Successfully binded user");
        },
        error: function (resp) {
          console.log("Can't bind user because user not found");
          client.disconnect();
        }
      });
    }
    callback(message);
  },
  connected: false
};

client.addExtension(bindClientIDWithUser);

window.connectChat = function () {
  // define elements
  $chatBox = $("#chat");
  $formBox = $('#new-message');
  $formBoxInputs = $formBox.find('input');
  $newMessageInput = $formBox.find('#message');
  $deleteBox = $('#delete-messages');

  var subscribeChat = function () {
    $chatBox.text('');
    client.subscribe('/chat', function(payload) {
      console.log("message recieved", payload);
      $chatBox.append("<p><span>" + moment(payload.created_at).format() + ": </span>" + payload.message + "</p>");
      scrollHeight = $chatBox[0].scrollHeight;
      $chatBox.scrollTop(scrollHeight);
    });
  };

  var bindSubmitPublishChat = function () {
    $formBox.off().on("submit", function(e){
      e.preventDefault();

      client.publish('/chat', {
        message: $newMessageInput.val(),
        created_at: moment().format()
      });

      $newMessageInput.val("");
      $newMessageInput.focus();
    });
  };

  var init = function () {
    subscribeChat();
    bindSubmitPublishChat();
  };

  init();
};

window.disconnectChat = function () {
  // define elements
  $chatBox = $("#chat");
  $formBox = $('#new-message');
  $formBoxInputs = $formBox.find('input');
  $newMessageInput = $formBox.find('#message');
  $deleteBox = $('#delete-messages');

  var unsubscribeChat = function () {
    client.disconnect();
  };

  var unBindSubmitPublishChat = function () {
    $formBox.off().on("submit", function(e){
      e.preventDefault();
      $chatBox.append("<p><span>Please Login To Chat</span></p>");
      $newMessageInput.val("");
    });
  };

  var init = function () {
    unsubscribeChat();
    unBindSubmitPublishChat();
  };

  init();
};