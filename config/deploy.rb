ssh_options[:compression] = false

set  :application,    "home"

set  :use_sudo,       false
role :app,            "jonathan@jpalardy.com"

set :repository,      '.'
set :scm,             :git
set :deploy_via,      :copy
set  :deploy_to,      "/home/jonathan/production/#{application}"
set :copy_strategy,   :export

# don't do a bunch of Rails stuff
namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart do ; end
  task :finalize_update do ; end
end

after "deploy:update_code", "deploy:symlink_shared"
namespace :deploy do
  task :symlink_shared do
    run "ln -nfs #{shared_path}/config/kanjis.json #{release_path}/public/kanji2012/js/kanjis.json"
  end
end

