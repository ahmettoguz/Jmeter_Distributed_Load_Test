# Kullanım

- script klasörüne gidiyoruz.

- prepare.sh ile k8s configürasyonları yapılıyor.

- upTerraform.sh ile minikube başlatılıyor.

- upCluster.sh sh ile podları hazırlayıp kaldırıyoruz.

- runTest.sh ile testleri koşuyoruz.

- result.sh ile sonuçları results dizinine belirtilen dosya adı (id ile) getiriyoruz.

- downTerraform.sh ile oluşturulan podları kapatıp minikube'ü durduruyoruz.

</br>

# Komutlar

```
bash prepare.sh <node count> <pod count> <thread count> <duration>
```

```
bash upTerraform.sh
```

```
bash upCluster.sh
```

```
bash runTest.sh
```

```
bash result.sh <testId>
```

```
bash downTerraform.sh
```
