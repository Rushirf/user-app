resource "aws_eks_cluster" "mycluster" {
  name = var.eks.cluster.name
  version = var.eks.cluster.kubernetes_version
  role_arn = aws_iam_role.cluster-role.arn
  depends_on = [ aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy ]

  vpc_config {
    subnet_ids = [aws_subnet.userapp-private-subnet["private_subnet_1"].id,aws_subnet.userapp-private-subnet["private_subnet_2"].id]
  }

}

resource "aws_eks_node_group" "mynodegroup" {
  cluster_name = aws_eks_cluster.mycluster.name
  node_group_name = var.eks.node_group.name
  node_role_arn = aws_iam_role.node-role.arn
  subnet_ids = [aws_subnet.userapp-private-subnet["private_subnet_1"].id,aws_subnet.userapp-private-subnet["private_subnet_2"].id]
  instance_types = var.eks.node_group.instance_types
  scaling_config {
    desired_size = var.eks.node_group.desired_size
    max_size = var.eks.node_group.max_size
    min_size = var.eks.node_group.min_size
  }
  depends_on = [ aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly, aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy, aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy ]
}

resource "aws_eks_addon" "eks-addons" {
  cluster_name = aws_eks_cluster.mycluster.name
  for_each = var.eks.addons
  addon_name = each.value.name
  addon_version = each.value.version

}


resource "aws_iam_role" "cluster-role" {
  name = var.eks.cluster-role.name
  assume_role_policy = file("eks-cluster-trust-policy.json")
}

resource "aws_iam_role" "node-role" {
  name = var.eks.node_role.name
  assume_role_policy = file("eks-node-trust-policy.json")
}

resource "aws_iam_role_policy_attachment" "cluster_AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.cluster-role.name
}

resource "aws_iam_role_policy_attachment" "AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.node-role.name
}

resource "aws_iam_role_policy_attachment" "AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.node-role.name
}

resource "aws_iam_role_policy_attachment" "AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.node-role.name
}

resource "aws_iam_role_policy_attachment" "CertificateManagerFullAccess" {
  policy_arn = "arn:aws:iam::aws:policy/AWSCertificateManagerFullAccess"
  role       = aws_iam_role.node-role.name
}

resource "aws_iam_role_policy_attachment" "externalDNS" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonRoute53FullAccess"
  role       = aws_iam_role.node-role.name
}

resource "aws_iam_role_policy_attachment" "CloudWatchFullAccess" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccess"
  role       = aws_iam_role.node-role.name
}

resource "aws_iam_policy" "AWSLoadBalancerControllerIAMPolicy" {
  name = var.eks.iam_policy.name
  policy = file("eks_service_account_iam_policy.json")
}

resource "aws_iam_role" "eks_service_account_role" {
  name = var.eks.service_account_role.name
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks_oidc.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${aws_iam_openid_connect_provider.eks_oidc.url}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks-service-account-policy-attachment" {
  role = aws_iam_role.eks_service_account_role.name
  policy_arn = aws_iam_policy.AWSLoadBalancerControllerIAMPolicy.arn
}

resource "aws_iam_openid_connect_provider" "eks_oidc" {
  url = aws_eks_cluster.mycluster.identity[0].oidc[0].issuer
  client_id_list  = ["sts.amazonaws.com"]
  #thumbprint_list = ["9e99a48a9960b14926bb7f3b02e22da0ecd0e645"]
}