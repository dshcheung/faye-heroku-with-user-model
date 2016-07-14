class PostsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    @posts = Post.includes(:user).all
  end

  def show
  end

  def create
    @post = current_user.posts.new(post_params)
    if @post.save
      render 'show'
    else
      render json: @post.errors.messages, status: 400
    end
  end

  def update
    @post.assign_attributes(post_params)
    if @post.save
      render 'show'
    else
      render json: @post.errors.messages, status: 400
    end
  end

  def destroy
    @post.destroy

    head :ok
  end

private

  def set_post
    @post = Post.includes(:user).find_by_id(params[:id])
    if @post.nil?
      render json: {message: "Cannot find post with ID #{params[:id]}"}
    end
  end

  def post_params
    params.require(:post).permit(:title, :content)
  end
end
