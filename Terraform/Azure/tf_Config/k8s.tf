
variable "aks_service_principal_app_id" {
  default = ""
}

variable "aks_service_principal_client_secret" {
  default = ""
}

terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.80.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  location = "Germany West Central"
  name     = "k8srg"
}

resource "azurerm_kubernetes_cluster" "k8s" {
  depends_on = [azurerm_resource_group.rg] 
  location            = azurerm_resource_group.rg.location
  name                = "k8s"
  resource_group_name = azurerm_resource_group.rg.name

  dns_prefix          = "k8s"
  tags                = {
    Environment = "Development"
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = "Standard_D2_v2"
    node_count = 80
  }
  linux_profile {
    admin_username = "ahmet"

    ssh_key {
      key_data = file("~/.ssh/id_rsa.pub")
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
  service_principal {
    client_id     = var.aks_service_principal_app_id
    client_secret = var.aks_service_principal_client_secret
  }
}

