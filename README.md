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
- [Geliştiriciler](#contributorsHeader)

<br/>

<h2 id="introductionHeader">📌 Proje Hakkında</h2> 

Bu proje, dinamik olarak bulut üzerinde oluşturulan altyapı üzerinde dağıtık yük testi gerçekleştirmeyi ve bu hizmeti web servis aracılığı ile sunmayı hedeflemektedir.

<br/>

<h2 id="technologiesHeader">☄️ Teknolojiler</h2> 

### Test

- [![Jmeter](https://img.shields.io/badge/Jmeter-black?style=for-the-badge&logo=apache&labelColor=black&color=D22128&logoColor=D22128)](https://jmeter.apache.org/)

<br/>

### Web

- [![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](nodejs.org)

- [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

- [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

- [![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
  
- [![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)

<br/>

### Database

- [![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

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
  
* MongoDb

<br/>

### Cli Araçları

* bash

* kubectl
  
* doctl
  
* az

* aws

* terraform
  
<br/>

### Üyelikler

* Digital Ocean

* Azure

* AWS

<br/>

<h2 id="instructionsHeader">📋 Talimatlar</h2>

- Bash scriptlerinin çalıştırılabilmesi için linux makine kullanılması önerilir. Bu sebeple Digital Ocean'dan bir dropleti projeyi çalıştırmak için kullandım. Aşağıda önce Digital Ocean dropletinin konfigürasyonunu ve sonrasında da gerekli programların kurulumları ve gerekli konfigüraysonları anlattım.

- Eğer projenin çalıştırılacağı makine uzak bir makine ise, web consolunu veya ssh bağlantısını kullanarak makineye bağlanabilirsiniz.

<br/>

### Makine Kurulumu

- doctl Kurulumu

```bash
snap install doctl
```

<br/>

- Güvenlik Duvarı İzinleri

```bash
mkdir ~/.config
export XDG_CONFIG_HOME=~/.config
doctl auth init
```
<br/>


```bash
doctl compute firewall list 
doctl compute firewall create --name porthost --inbound-rules "protocol:tcp,ports:80,address:0.0.0.0/0"
doctl compute firewall create --name portwebsocket --inbound-rules "protocol:tcp,ports:8080,address:0.0.0.0/0"
doctl compute firewall create --name portmongodb --inbound-rules "protocol:tcp,ports:27017,address:0.0.0.0/0"
```

<br/>

### Program Kurulumu

- Docker Kurulumu

```bash
apt install docker.io
```

<br/>

- Node Js Kurulumu

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install node
nvm alias default node
node -v
```

<br/>

- Terraform Kurulumu

```bash
apt install unzip

curl -O https://releases.hashicorp.com/terraform/1.1.0/terraform_1.1.0_linux_amd64.zip
unzip terraform_1.1.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

<br/>

- Kubectl Kurulumu
```bash
snap install kubectl --classic
```

<br/>

- Aws Kurulumu

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

<br/>

- Az Kurulumu

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

<br/>

- Minikube Kurlumu

```bash
wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
cp minikube-linux-amd64 /usr/local/bin/minikube
chmod 755 /usr/local/bin/minikube
minikube version
```

<br/>
        
### Program Konfigürasyonları

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

<br/>

### Veri Tabanının Çalıştırılması

- Verilerin işlenmesi MongoDb ile yapılmaktadır. Veritabanını docker container'ı ayağa kaldırarak çalıştırıyoruz ve volume kullanarak verilerimizin saklıyoruz (şifreyi değiştirin).

```bash
docker run -d -p 27017:27017 --name mongo-c -v "$(pwd)/database:/data/db" -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 mongo
```

<br/>

- Veritabanını ayağa kaldırdıktan sonra MongoDb Compass yardımıyla veritabanına gui modunda erişebiliyoruz. Bağlantı stringi olarak bunu kullanıyoruz.

```bash
mongodb://admin:admin123@<remoteIp>/?authMechanism=DEFAULT&authSource=admin
```

<br/>

### Backend Servisinin Çalıştırılması

- Backend dizinde paketlerin yüklenmesi.
 ```bash
npm install
```

<br/>

- Backend servisini çalıştırılması.
 ```bash
npm run start
```

<br/>

<h2 id="contributorsHeader">👥 Geliştiriciler</h2> 

<a href="https://github.com/ahmettoguz" target="_blank"><img width=60 height=60 src="https://avatars.githubusercontent.com/u/101711642?v=4"></a> 
<a href="https://github.com/cevikkursat" target="_blank"><img width=60 height=60 src="https://avatars.githubusercontent.com/u/93974142?v=4"></a>

[🔝](#mainHeader)
