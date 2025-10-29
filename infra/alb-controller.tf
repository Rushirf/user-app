resource "kubernetes_service_account" "eks-service-account" {
  metadata {
    name = var.eks.service_account.name
    namespace = "kube-system"
    annotations = {
        "eks.amazonaws.com/role-arn" = aws_iam_role.eks_service_account_role.arn
    }
  }
}

resource "helm_release" "alb_controller" {
  name = var.helm.release_name
  repository = var.helm.repo
  chart = var.helm.chart
  namespace = var.helm.namespace
  version = var.helm.version
  atomic = true
  cleanup_on_fail = true

  depends_on = [
    kubernetes_service_account.eks-service-account
  ]

  set = [ 
   {
      name = "clusterName"
      value = aws_eks_cluster.mycluster.name
   },
   {
    name  = "serviceAccount.create"
    value = "false" 
   },
   {
    name = "serviceAccount.name"
    value = var.eks.service_account.name
   },
   {
    name = "region"
    value = var.helm.region
   },
   {
    name = "vpcId"
    value = aws_vpc.userapp-vpc.id
   }
    ]
}

