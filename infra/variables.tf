# Network
variable "vpc_cidr" {
  type = string
}

variable "private_subnets" {}

variable "public_subnets" {}

variable "security_groups" {}

variable "eks" {}