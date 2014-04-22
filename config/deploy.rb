
lock '3.2.1'

set :application, 'home'
set :deploy_to, "/home/atlas/home"
set :repo_url, "https://github.com/jpalardy/home.git"

set :ssh_options, { compression: "none" }

