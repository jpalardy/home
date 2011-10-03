ssh_options[:compression] = false

set  :application,    "home"

set  :use_sudo,       false
role :app,            "jonathan@jpalardy.com"

set  :scm, :git
set  :repository,     "git://github.com/jpalardy/#{application}.git"

set  :deploy_via,     :remote_cache
set  :deploy_to,      "/home/jonathan/production/#{application}"

# don't do a bunch of Rails stuff
namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart do ; end
  task :finalize_update do ; end
end

