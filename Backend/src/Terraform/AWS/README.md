# Kullanım

- script dizinine gidiyoruz.

- service access ve secret keyi set ediyoruz.

- prepare.sh ile terraform, k8s configürasyonları yapılıyor.

- upTerraform.sh ile clusterı ve nodları kaldırıyoruz.

- upCluster.sh sh ile podları hazırlayıp kaldırıyoruz.

- runTest.sh ile testleri koşuyoruz.

- result.sh ile sonuçları results dizinine belirtilen dosya adı (id ile) getiriyoruz.

- downCluster.sh ile oluşturulan podları siliyoruz (downTerraform yapılacaksa bu adıma gerek yok. Podlar otomatik silinecek).

- downTerraform.sh ile oluşturulan nodeları ve clusterı siliyoruz.

</br>

# Komutlar

```
bash token.sh <aws access_key> <aws secret_key>
```
---

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
bash downCluster.sh
```

```
bash downTerraform.sh
```
