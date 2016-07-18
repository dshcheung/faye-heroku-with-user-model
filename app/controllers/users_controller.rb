class UsersController < ApplicationController
  before_action :authenticate_user!

  def bind_user
    require 'eventmachine'

    EM.run {
      client = Faye::Client.new('http://localhost:3000/faye')

      publication = client.publish('/chat', {
        message: "#{current_user.email.upcase} has Joined!",
        created_at: Time.now
      })

      publication.callback do
        client.disconnect
      end

      publication.errback do |error|
        puts 'There was a problem: ' + error.message
        client.disconnect
      end
    }

    current_user.update(chat_online: true, chat_client_id: params[:client_id])

    head 200
  end
end
