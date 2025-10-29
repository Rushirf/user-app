# VPC
vpc_cidr = "10.100.0.0/16"

public_subnets = {

  public_subnet_1 = {
    cidr_block = "10.100.1.0/24"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = true
    name = "userapp-public-subnet-a"
    tags = {
      "kubernetes.io/role/elb" = "1"
    }
  },

  public_subnet_2 = {
    cidr_block = "10.100.2.0/24"
    availability_zone = "us-east-1b"
    map_public_ip_on_launch = true
    name = "userapp-public-subnet-b"
    tags = {
      "kubernetes.io/role/elb" = "1"
    }
  }
}

private_subnets = {

  private_subnet_1 = {
    cidr_block = "10.100.3.0/24"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = false
    name = "userapp-private-subnet-a"
  },

  private_subnet_2 = {
    cidr_block = "10.100.4.0/24"
    availability_zone = "us-east-1b"
    map_public_ip_on_launch = false
    name = "userapp-private-subnet-b"
  }
}

security_groups = {
  
} 

eks = {
  
  cluster = {
    name = "my-cluster"
    kubernetes_version = "1.33"
  }

  node_group = {
    name = "my-node-group"
    desired_size = 2
    max_size     = 2
    min_size     = 2
    instance_types = ["m7i-flex.large"]

  }

  addons = {
    "vpc-cni" = {name = "vpc-cni", version = "v1.20.4-eksbuild.1"}
    "coredns" = {name = "coredns", version = "v1.12.1-eksbuild.2"}
    "eks-node-monitoring-agent" = {name = "eks-node-monitoring-agent", version = "v1.4.1-eksbuild.1"}
    "kube-proxy" = {name = "kube-proxy", version = "v1.33.3-eksbuild.4"}
    "eks-pod-identity-agent" = {name = "eks-pod-identity-agent", version = "v1.3.9-eksbuild.3"}
    "metrics-server" = {name = "metrics-server", version = "v0.8.0-eksbuild.2"}
    "external-dns" = {name = "external-dns", version = "v0.19.0-eksbuild.2"}
    "cert-manager" = {name = "cert-manager", version = "v1.19.1-eksbuild.1"}
  }

  cluster-role = {
    name = "eks-cluster-role"
  }

  node_role = {
    name = "eks-node-role"
  }

  service_account_role = {
    name = "eks-service-account-role"
  }

  iam_policy = {
    name = "AWSLoadBalancerControllerIAMPolicy"
  }

  service_account = {
    name = "aws-load-balancer-controller"
  }
  
}

helm = {
  release_name = "aws-load-balancer-controller"
  chart = "aws-load-balancer-controller"
  repo = "https://aws.github.io/eks-charts"
  namespace = "kube-system"
  version = "1.14.0"
  region = "us-east-1"
}
