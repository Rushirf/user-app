terraform {
  required_providers {
    helm = {
      source = "hashicorp/helm"
      version = "3.0.2"
    }
    aws = {
      source = "hashicorp/aws"
      version = "6.20.0"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.38.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "helm" {
  kubernetes = {
    host = aws_eks_cluster.mycluster.endpoint
    cluster_ca_certificate = base64decode(aws_eks_cluster.mycluster.certificate_authority[0].data)
    exec = {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", aws_eks_cluster.mycluster.name]
      command     = "aws"
    }
  }
}

provider "kubernetes" {
  host = aws_eks_cluster.mycluster.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.mycluster.certificate_authority[0].data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", aws_eks_cluster.mycluster.name]
    command     = "aws"
  }
}
