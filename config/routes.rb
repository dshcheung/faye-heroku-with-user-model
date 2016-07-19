Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  root 'statics#main'

  resources :posts

  post '/bind_user', to: 'users#bind_user'

  get '/users/chat/online', to: 'users#chat_online'
 end
