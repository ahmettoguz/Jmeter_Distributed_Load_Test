<h1 id="mainHeader" align="center">Jmeter <br/> Distributed Load Test</h1> 

<br>

<div align="center">
    <img width=400 src="src/favicon.png">
</div>

<br/>

## İçindekiler

- [Proje Hakkında](#introductionHeader)
- [Teknolojiler](#technologiesHeader)
- [Özellikler](#featuresHeader)
- [Bağımlılıklar](#prerequisitesHeader)
- [Talimatlar](#instructionsHeader)
- [Katkıda Bulunanlar](#contributorsHeader)

<br/>

<h2 id="introductionHeader">📌 Proje Hakkında</h2> 

Bu proje, dinamik olarak bulut üzerinde oluşturulan altyapı üzerinde dağıtık yük testi gerçekleştirmeyi ve bu hizmeti web servis aracılığı ile sunmayı hedeflemektedir.

<br/>

<h2 id="technologiesHeader">☄️Teknolojiler</h2> 

### Test

- [![Jmeter](https://img.shields.io/badge/Jmeter-black?style=for-the-badge&logo=apache&labelColor=black&color=D22128&logoColor=D22128)](https://jmeter.apache.org/)

<br/>

### DevOps

- [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

- [![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
  
- [![Minikube](https://img.shields.io/badge/minikube-37BEFF?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)

- [![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)

<br/>

### Bulut Sağlayıcılar

- [![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

- [![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)

- [![DigitalOcean](https://img.shields.io/badge/DigitalOcean-%230167ff.svg?style=for-the-badge&logo=digitalOcean&logoColor=white)](https://www.digitalocean.com/)

<br/>

### Web

- [![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](nodejs.org)

- [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

- [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

- [![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)

- [![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)

<br/>

### Database

- [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<br/>

<h2 id="featuresHeader">✨ Özellikler</h2> 

* Minikube, Digital Ocean, Azure ve Aws ile farklı ortamlarlarda dinamik olarak test koşma olanağı.
* Kullanıcı verilerinin veritabanına işlenmesi.
* JWT access key ile kimlik doğrulaması.
* Websocket ile anlık test durumunun kullanıcıya bildirilmesi.
* Koşulan testlerin sonuçlarının dashboard üzerinden sergilenmesi ve servis edilmesi.
* Http isteklerinin simülasyonu.

<br/>

<h2 id="prerequisitesHeader">🔒 Bağımlılıklar</h2>

### Programlar

* Docker

* Minikube
  
* NodeJs

<br/>

### Cli Araçları

* kubectl
  
* doctl
  
* az

* terraform

* aws

<br/>

<h2 id="instructionsHeader">📋 Talimatlar</h2>

### Uzak Makine Konfigurasyonları


------------------------------- Docker Installation
    $ apt install docker.io

------------------------------- Docker-Compose Installation
    $ apt install docker-compose

------------------------------- Node Js Installation
    $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    $ source ~/.bashrc
    $ nvm install node
    $ nvm alias default node
    $ node -v

------------------------------- Terraform Installation
    $ curl -O https://releases.hashicorp.com/terraform/1.1.0/terraform_1.1.0_linux_amd64.zip
    $ unzip terraform_1.1.0_linux_amd64.zip
    $ sudo mv terraform /usr/local/bin/

------------------------------- Kubectl Installation
    https://pwittrock.github.io/docs/tasks/tools/install-kubectl/

    $ snap install kubectl --classic

------------------------------- Aws Installation and configuration
    https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#cliv2-linux-install

------------------------------- Az Installation and configuration
    https://learn.microsoft.com/bs-latn-ba/cli/azure/install-azure-cli-linux?pivots=apt
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

    az login
    or
    az login --tenant <TenantId>
    
    az account show

------------------------------- Minikube Installation and configuration
    https://docs.altinity.com/altinitykubernetesoperator/kubernetesinstallguide/minikubeonlinux/

    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
    ---
    https://medium.com/@dileepjallipalli/how-to-install-and-use-minikube-for-k8s-ee30a75ce8bc

    apt-get install curl wget apt-transport-https -y

    wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    cp minikube-linux-amd64 /usr/local/bin/minikube
    hmod 755 /usr/local/bin/minikube
    minikube version
    
    minikube start --force


    $ apt install unzip

------------------------------- Digital Ocean configs for droplet
    $ snap install doctl

    Get token from api section enable write option.
    Set this token to machine
        $ mkdir ~/.config
        $ export XDG_CONFIG_HOME=~/.config
        $ doctl auth init

    Firewall Configs
        $ doctl compute firewall list 
        $ doctl compute firewall create --name portfft --inbound-rules "protocol:tcp,ports:443,address:0.0.0.0/0"
        $ doctl compute firewall create --name porte --inbound-rules "protocol:tcp,ports:80,address:0.0.0.0/0"
        $ doctl compute firewall create --name portee --inbound-rules "protocol:tcp,ports:8080,address:0.0.0.0/0"
        $ doctl compute firewall create --name portmongodb --inbound-rules "protocol:tcp,ports:27017,address:0.0.0.0/0"
        $ doctl compute firewall list
        

<br/>

- kubectl dosyasının yetkilendirilmesi

```bash
chmod 777 /root/.kube/config
```

<br/>

- İletişim anahtarı oluşturulması
```bash
ssh-keygen -t rsa -b 2048
```

<br/>

- Azure yetkilendirmesi.

```bash
az login
```

<br/>

- AWS yetkilendirmesi.

```bash
aws configure
```

- Eğer projenin çalıştırılacağı makine uzak bir makine ise, web consolunu veya ssh bağlantısını kullanarak makineye bağlanabilirsiniz.




### Veri Tabanı
- Verilerin işlenmesi MongoDb ile yapılmaktadır. Veritabanını docker container'ı ayağa kaldırarak çalıştırıyoruz ve volume kullanarak verilerimizin kaybedilmemesini sağlıyoruz (şifreyi değiştirin).

```bash
docker run -d -p 27017:27017 --name mongo-c -v "$(pwd)/database:/data/db" -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 mongo
```

<br/>

- Veritabanını ayağa kaldırdıktan sonra MongoDb Compass yardımıyla veritabanına gui modunda erişebiliyoruz. Bağlantı stringi olarak bunu kullanıyoruz.

```bash
mongodb://admin:admin123@167.99.140.168:27017/?authMechanism=DEFAULT&authSource=admin
```

<br/>




<br/>

<h2 id="contributorsHeader">👥 Geliştiriciler</h2> 

<a href="https://github.com/ahmettoguz" target="_blank"><img width=60 height=60 src="https://avatars.githubusercontent.com/u/101711642?v=4"></a> 
<a href="https://github.com/cevikkursat" target="_blank"><img width=60 height=60 src="https://avatars.githubusercontent.com/u/93974142?v=4"></a>

[🔝](#mainHeader)

