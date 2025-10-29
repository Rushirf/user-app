terraform {
  backend "s3" {
    bucket = "rushi-terraform-backend-bucket"
    key = "userapp/eks.tfstate"
    region = "us-east-1"
  }
}