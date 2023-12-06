# Description

- Home dizinine gidip projeyi çekiyoruz.

- Home dizininde ssh oluşturuyoruz (hedef dizine ~ vermeliyiz).

- Script dizinine gidip service principal id ve passwordumuzu expose ediyoruz.

- prepare.sh ile terraform, k8s configürasyonları yapılıyor.

- upTerraform.sh ile clusterı ve nodları kaldırıyoruz.

- upCluster.sh sh ile podları hazırlayıp kaldırıyoruz.

- runTest.sh ile testleri koşuyoruz.

- result.sh ile sonuçları results dizinine getiriyoruz.

- downCluster.sh ile oluşturulan podları siliyoruz (downTerraform yapılacaksa bu adıma gerek yok. Podlar otomatik silinecek).

- downTerraform.sh ile oluşturulan nodeları ve clusterı siliyoruz.

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
chmod +x token.sh prepare.sh upTerraform.sh upCluster.sh runTest.sh result.sh downCluster.sh downTerraform.sh
```

```
sh token.sh <service principle id> <service principle password>
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
sh result.sh
```

```
sh downCluster.sh
```

```
sh downTerraform.sh
```