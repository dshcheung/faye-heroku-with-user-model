class UnbindUserController
  MONITORED_CHANNELS = [ '/meta/disconnect' ]

  def incoming(message, callback)
    return callback.call(message) unless MONITORED_CHANNELS.include? message['channel']
    puts message.inspect

    current_user = User.find_by(chat_client_id: message["clientId"])

    if current_user
      faye_client.publish('/chat', { message: "#{current_user.email.upcase} has Left!", created_at: Time.now })

      current_user.update(chat_online: false, chat_client_id: nil)
    end

    callback.call(message)
  end

  def faye_client
    @faye_client ||= Faye::Client.new('http://localhost:3000/faye')
  end
end

# for future reference
# class ClientEvent
#   MONITORED_CHANNELS = [ '/meta/subscribe', '/meta/disconnect' ]

#   def incoming(message, callback)
#     puts message.inspect
#     return callback.call(message) unless MONITORED_CHANNELS.include? message['channel']

#     action = message["channel"].split('/').last


#     if name = get_client(message["clientId"], action)
#       faye_client.publish('/comments', { message: build_hash(name, action), created_at: Time.now })
#     end
#     callback.call(message)
#   end

#   def build_hash(name, action)
#     message = ""

#     if action == 'subscribe'
#       message = "#{name} has entered."
#     elsif action == 'disconnect'
#       message = "#{name} has left."
#     end

#     message
#   end

#   def connected_clients
#     @connected_clients ||= { }
#   end

#   def push_client(client_id)
#     connected_clients[client_id] = "Guest #{rand(10000)}"
#   end

#   def pop_client(client_id)
#     connected_clients.delete(client_id)
#   end

#   def get_client(client_id, action)
#     if action == 'subscribe'
#       push_client(client_id)
#     elsif action == 'disconnect'
#       pop_client(client_id)
#     end
#   end

#   def faye_client
#     @faye_client ||= Faye::Client.new('http://localhost:3000/faye')
#   end
# end
