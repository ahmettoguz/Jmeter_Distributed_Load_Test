*******************
# Description

0. Kubernetes ortamını hazırlıyoruz. Minikube'de çalışılıcaksa komutlar minikube.txt içerisinde.

1. sh dosyalarına x veriyoruz.

2. jmeter dosyası ve k8 yaml dosyaları prepare.sh dosyasında sırasıyla pod ve thread sayısı olarak verilerek dosyalar oluşturulur

3. Dosya konumuna gelip start sh ile podları hazırlıyoruz.

4. command.txt dosyasına testleri başlatıcak komut üretilecek bu komutu terminalde çalıştırıyoruz.

5. Sonuçları getirmek ve podları silmek için finish sh çalıştırıyoruz.

*******************
# Commands
chmod 777 prepare.sh
chmod 777 start.sh
chmod 777 finish.sh

        // pod  thread
.\prepare.sh 5 10

.\start.sh

command in command.txt 

.\finish.sh


