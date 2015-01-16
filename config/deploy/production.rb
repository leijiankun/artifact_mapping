# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.

# role :app, %w{deploy@example.com}
# role :web, %w{deploy@example.com}
# role :db,  %w{deploy@example.com}


# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server definition into the
# server list. The second argument is a, or duck-types, Hash and is
# used to set extended properties on the server.

set :stage,     :production
set :rails_env, "production"

# ============ 以下的branch名字可能需要修改，请注意！=======================
# ask :branch, proc { `git rev-parse --abbrev-ref 20140801`.chomp }.call
# ====================================================================

# set :rbenv_ruby_dir, '/root/.rbenv/versions/2.1.2/bin'

server '121.40.96.243', user: 'root', roles: %w{web app} #, my_property: :my_value


set :rbenv_path,    "/root/.rbenv"
set :current_path,  "#{deploy_to}/current"

set :linked_files,  %w{
    config/database.yml 
    config/secrets.yml 
    }

# Use unicorn_rails & rainbows
set :unicorn_config,  "#{current_path}/config/unicorn.rb"
set :unicorn_pid,     "#{current_path}/tmp/pids/unicorn.pid"
set :rackup_file,     "#{current_path}/config.ru"

namespace :deploy do
  desc "Start rainbows in production mode"
  task :start do
    on roles :app do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :bundle, "exec rainbows -c #{fetch(:unicorn_config)} -D #{fetch(:rackup_file)}"
        end
      end
    end
  end

  desc "Stop rainbows"
  task :stop do
    pid = fetch(:unicorn_pid)
    on roles :app do
      execute "if [ -f #{pid} ]; then kill -QUIT `cat #{pid}`; fi"
    end
  end

  desc "Restart rainbows"
  task :restart do
    pid = fetch(:unicorn_pid)
    on roles :app do
      execute "if [ -f #{pid} ]; then kill -USR2 `cat #{pid}`; fi"
    end
  end

  namespace :db do
    desc "rake db:seed"
    task :seed do
      on roles :app do
        within release_path do
          with rails_env: fetch(:rails_env) do
            execute :rake, "db:seed"
          end
        end
      end
    end
  end

  namespace :assets do 
    desc "rake assets:cdn"
    task :cdn do
      on roles :app do
        within release_path do 
          with rails_env: fetch(:rails_env) do
            execute :rake, "assets:cdn"
            # execute "/root/qrsync /root/qiniu_conf.json"
          end
        end
      end
    end
  end

end

# after "deploy:assets:precompile", "deploy:assets:cdn"


# Custom SSH Options
# ==================
# You may pass any option but keep in mind that net/ssh understands a
# limited set of options, consult[net/ssh documentation](http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start).
#
# Global options
# --------------
#  set :ssh_options, {
#    keys: %w(/home/rlisowski/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }
#
# And/or per server (overrides global)
# ------------------------------------
# server 'example.com',
#   user: 'user_name',
#   roles: %w{web app},
#   ssh_options: {
#     user: 'user_name', # overrides user setting above
#     keys: %w(/home/user_name/.ssh/id_rsa),
#     forward_agent: false,
#     auth_methods: %w(publickey password)
#     # password: 'please use keys'
#   }
