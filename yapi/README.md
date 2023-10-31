*******************
# Description

0. Kubernetes ortamını hazırlıyoruz. Minikube'de çalışılıcaksa komutlar minikube.txt içerisinde. 

1. jmeter dosyası ve k8 yaml dosyaları prepare.sh dosyasında sırasıyla pod ve thread sayısı olarak verilerek dosyalar oluşturulur

2. Dosya konumuna gelip start sh ile podları hazırlıyoruz.

3. command.txt dosyasına testleri başlatıcak komut üretilecek bu komutu terminalde çalıştırıyoruz.

4. Sonuçları getirmek ve podları silmek için finish sh çalıştırıyoruz.

*******************
# Commands
        // pod  thread
.\prepare.sh 5 10

.\start.sh

command in command.txt 

.\finish.sh


