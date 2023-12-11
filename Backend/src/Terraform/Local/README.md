# Description

- Home dizinine gidip projeyi çekiyoruz.

- prepare.sh ile k8s configürasyonları yapılıyor.

- upTerraform.sh ile minikube başlatılıyor.

- upCluster.sh sh ile podları hazırlayıp kaldırıyoruz.

- runTest.sh ile testleri koşuyoruz.

- result.sh ile sonuçları results dizinine belirtilen dosya adı (id ile) getiriyoruz.

- downTerraform.sh ile oluşturulan podları kapatıp minikube'ü durduruyoruz.

</br>

# Commands

```
cd ~
```

```
git clone https://github.com/ahmettoguz/jmeter_Test
```
---

```
cd ~/jmeter_Test/Terraform/Local/script
```

```
chmod +x token.sh prepare.sh upTerraform.sh upCluster.sh runTest.sh result.sh downCluster.sh downTerraform.sh
```
---

```
sh prepare.sh <node count> <pod count> <thread count> <duration>
```

```
sh upTerraform.sh
```

```
sh upCluster.sh
```

```
sh runTest.sh
```

```
sh result.sh <testId>
```

```
sh downTerraform.sh
```