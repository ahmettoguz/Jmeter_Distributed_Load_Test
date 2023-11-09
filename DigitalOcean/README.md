# Description

* Script klasöründe prepare.sh dosyasına executable yetkisi veriyoruz.

* prepare sh ile jmx ve pod sayılarını belirliyoruz.  

* up sh ile podları hazırlıyoruz ve testleri koşuyoruz

* Sonuçları results klasörüne getirmek silmek için result.sh çalıştırıyoruz.

* Oluşturulan podları silmek için down sh çalıştırıyoruz.

</br>

# Commands

```
chmod +x prepare.sh
```
Sırasıyla pod sayısı ve thread sayısı
```
./prepare.sh 1 10
```

```
./up.sh
```

```
./result.sh
```

```
./down.sh
```
