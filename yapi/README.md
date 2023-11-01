*******************
# Description

0. Kubernetes ortamını hazırlıyoruz. Minikube'de çalışılıcaksa komutlar minikube.txt içerisinde.

1. sh dosyalarına x veriyoruz.

2. jmeter dosyası ve k8 yaml dosyaları 0.sh dosyasında sırasıyla pod ve thread sayısı olarak verilerek dosyalar oluşturulur.

3. Dosya konumuna gelip start sh ile podları hazırlıyoruz.

4. command.sh dosyasına testleri başlatıcak komut üretilecek bu komutu terminalde çalıştırıyoruz.

5. Sonuçları (result.jtl, summary.txt) getirmek ve podları silmek için result sh çalıştırıyoruz.

6. Oluşturulan podları silmek için down sh çalıştırıyoruz.

*******************
# Commands

```
chmod 777 prepare.sh
chmod 777 start.sh
chmod 777 result.sh
chmod 777 down.sh

.\prepare.sh 1 10

.\start.sh

.\command.sh

.\result.sh

.\down.sh

```
