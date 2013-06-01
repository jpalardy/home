
ssh_options[:compression] = false

set  :application,    "home"

set  :use_sudo,       false
role :app,            "atlas@jpalardy.com"

set :repository,      '.'
set :scm,             :git
set :deploy_via,      :copy
set :deploy_to,       "/home/atlas/#{application}"
set :copy_strategy,   :export

# don't do a bunch of Rails stuff
namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart do ; end
  task :finalize_update do ; end
end

