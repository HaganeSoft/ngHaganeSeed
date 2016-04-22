Vagrant.configure(2) do |config|
  config.vm.box = "geerlingguy/ubuntu1404"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.provision "shell", path: "provision.sh"
  config.vm.synced_folder ".", "/vagrant" 
end
