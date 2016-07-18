$(document).ready(function(){
  // faye stuff >>>>>
    window.client = new Faye.Client('/faye');
  // faye stuff <<<<<

  // define elements
  $chatBox = $("#chat");
  $formBox = $('#new-message');
  $formBoxInputs = $formBox.find('input');
  $newMessageInput = $formBox.find('#message');
  $deleteBox = $('#delete-messages');

  var subscribeToChat = function () {
    client.subscribe('/comments', function(payload) {
      console.log("message recieved", payload);
      $chatBox.append("<p><span>" + moment(payload.created_at).format() + ": </span>" + payload.message + "</p>");
      scrollHeight = $chatBox[0].scrollHeight;
      $chatBox.scrollTop(scrollHeight);
    });
  };

  var bindSubmitPublishChat = function () {
    $formBox.on("submit", function(e){
      e.preventDefault();

      client.publish('/comments', {
        message: $newMessageInput.val(),
        created_at: moment().format()
      });

      $newMessageInput.val("");
      $newMessageInput.focus();
    });
  };

  var init = function () {
    scrollHeight = $chatBox[0].scrollHeight;
    $chatBox.scrollTop(scrollHeight);
    subscribeToChat();
    bindSubmitPublishChat();
  };

  init();
});