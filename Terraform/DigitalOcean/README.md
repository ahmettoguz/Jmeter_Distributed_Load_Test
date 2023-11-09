# Description

- Script klasörüne gidip digital ocean api tokenimizi expose ediyoruz.

- Script klasöründe prepare.sh dosyasına executable yetkisi veriyoruz.

- prepare sh ile terraform, k8s ve jmx dosyalarını configürasyonları yapılıyor. (-n -p -t, sıraysıla Node, Pod ve Thread sayıları)
- up sh ile nodları ve podları hazırlıyoruz. Testleri koşuyoruz

- Sonuçları results klasörüne getirmek silmek için result.sh çalıştırıyoruz.

- Oluşturulan podları, ve cluster'ı silmek için down sh çalıştırıyoruz.

</br>

# Commands

```
cd /jmeter_Test/Terraform/DigitalOcean/script
```

```
chmod +x token.sh
```

```
./token.sh crt
```

```
chmod +x prepare.sh
```

```
./prepare.sh -n 1 -p 1 -t 10
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
