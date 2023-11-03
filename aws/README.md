*******************
https://github.com/ahmettoguz/jmeter_Test/blob/main/yapi/README.md
# Description

0. Kubernetes ortamını hazırlıyoruz. Minikube'de çalışılıcaksa komutlar minikube.txt içerisinde.

1. sh dosyalarına x veriyoruz.

2. jmeter dosyası ve k8 yaml dosyaları 0.sh dosyasında sırasıyla pod ve thread sayısı olarak verilerek dosyalar oluşturulur.

3. Dosya konumuna gelip up sh ile podları hazırlıyoruz.

4. run.sh dosyasına testleri başlatıcak komut üretilecek bu komutu terminalde çalıştırıyoruz.

5. Sonuçları (result.jtl, summary.txt) getirmek ve podları silmek için result sh çalıştırıyoruz.

6. Oluşturulan podları silmek için down sh çalıştırıyoruz.

*******************
# Commands

```
chmod 777 prepare.sh
chmod 777 up.sh
chmod 777 result.sh
chmod 777 down.sh
```
Sırasıyla pod sayısı ve thread sayısı
```
./prepare.sh 1 10
```

```
./up.sh
```

```
./run.sh
```

```
./result.sh
```

```
./down.sh
```