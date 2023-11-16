# Description

- Home dizinine gidip projeyi çekiyoruz.

- Home dizininde ssh oluşturuyoruz (hedef dizine ~ vermeliyiz).

- Script dizinine gidip service principal id ve passwordumuzu expose ediyoruz.

- prepare sh ile terraform, k8s ve jmx dosyalarını configürasyonları yapılıyor. (-n -p -t -d -u, sıraysıla: Node sayısı, Pod sayısı, Thread sayısı, Duration, Target Url)

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
ssh-keygen -t rsa -b 2048
```
---

```
cd ~/jmeter_Test/Terraform/Azure/script
```

```
chmod +x token.sh
```

```
sh token.sh <service principle id> <service principle password>
```
---

```
./prepare.sh 2 3
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
