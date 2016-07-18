class AddChatOnlineAndClientIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :chat_online, :boolean
    add_column :users, :chat_client_id, :string
  end
end
