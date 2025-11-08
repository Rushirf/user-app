resource "aws_s3_bucket" "userapp-s3-bucket" {
  bucket = var.s3.bucket_name
  force_destroy = var.s3.force_destroy
}


resource "aws_s3_bucket_versioning" "userapp-s3-bucket-versioning" {
  bucket = aws_s3_bucket.userapp-s3-bucket.bucket
  versioning_configuration {
    status = var.s3.versioning
  }
}


resource "aws_s3_bucket_public_access_block" "userapp_pab" {
  bucket = aws_s3_bucket.userapp-s3-bucket.bucket
  block_public_acls = var.s3.pab.block_public_acls
  block_public_policy = var.s3.pab.block_public_policy
  ignore_public_acls = var.s3.pab.ignore_public_acls
  restrict_public_buckets = var.s3.pab.restrict_public_buckets
}

