# Description

- Home dizinine gidip projeyi çekiyoruz.

- Script dizinine gidip digital ocean api tokenimizi expose ediyoruz.

- prepare sh ile terraform, k8s ve jmx dosyalarını configürasyonları yapılıyor. (-n -p -t, sıraysıla Node, Pod ve Thread sayıları)

- up sh ile nodları ve podları hazırlayıp kaldırıyoruz ardından testleri koşuyoruz.

- Sonuçları results dizinine getirmek için result.sh çalıştırıyoruz.

- Oluşturulan podları, nodeları ve cluster'ı silmek için down sh çalıştırıyoruz.

</br>

# Commands

```
cd ~
```

```
git clone https://github.com/ahmettoguz/jmeter_Test
```

```
cd ~/jmeter_Test/Terraform/DigitalOcean/script
```

```
chmod +x token.sh
```

```
source token.sh <yourToken>
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
