json.array! @posts do |post|
  json.partial! 'post_template', post: post
end