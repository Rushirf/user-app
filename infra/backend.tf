terraform {
  backend "s3" {
    bucket = "rushi-terraform-backend-bucket"
    key = "userapp/terraform.tfstate"
    region = "us-east-1"
  }
}