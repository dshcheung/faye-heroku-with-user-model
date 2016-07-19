class UsersController < ApplicationController
  before_action :authenticate_user!

  def bind_user
    require 'eventmachine'

    EM.run {
      publication = faye_client.publish('/chat', {
        message: "#{current_user.email.upcase} has Joined!",
        created_at: Time.now
      })

      publication.callback do
        faye_client.disconnect
      end

      publication.errback do |error|
        puts 'There was a problem: ' + error.message
        faye_client.disconnect
      end
    }

    current_user.update(chat_online: true, chat_client_id: params[:client_id])

    head 200
  end

  def faye_client
    @faye_client ||= Faye::Client.new(ENV['FAYE_SERVER_END_POINT'])
  end
end
