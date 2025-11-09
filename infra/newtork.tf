resource "aws_vpc" "userapp-vpc" {

  cidr_block = var.vpc_cidr
  enable_dns_hostnames = true
  tags = {
    Name = "userapp-vpc"
  }

}

resource "aws_subnet" "userapp-public-subnet" {

  vpc_id = aws_vpc.userapp-vpc.id
  for_each = var.public_subnets
  cidr_block = each.value.cidr_block
  availability_zone = each.value.availability_zone
  map_public_ip_on_launch = each.value.map_public_ip_on_launch
  tags = each.value.tags
}


resource "aws_subnet" "userapp-private-subnet" {

  vpc_id = aws_vpc.userapp-vpc.id
  for_each = var.private_subnets
  cidr_block = each.value.cidr_block
  availability_zone = each.value.availability_zone
  map_public_ip_on_launch = each.value.map_public_ip_on_launch
  tags = {
    Name = each.value.name
  }
  
}


resource "aws_internet_gateway" "userapp-igw" {
  vpc_id = aws_vpc.userapp-vpc.id
  tags = {
    Name = "userapp-igw"
  }
}


resource "aws_eip" "userapp-eip" {
  tags = {
    Name = "userapp-eip"
  }
}


resource "aws_nat_gateway" "userapp-ngw" {
  depends_on = [ aws_internet_gateway.userapp-igw ]
  subnet_id = aws_subnet.userapp-public-subnet["public_subnet_1"].id
  allocation_id = aws_eip.userapp-eip.id
  tags = {
    Name = "userapp-ngw"
  }
}


resource "aws_route_table" "userapp-public-route" {
  vpc_id = aws_vpc.userapp-vpc.id
  tags = {
    Name = "userapp-public-route"
  }

  route {
    cidr_block = aws_vpc.userapp-vpc.cidr_block
    gateway_id = "local"
  }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.userapp-igw.id
  }

}


resource "aws_route_table" "userapp-private-route" {
  vpc_id = aws_vpc.userapp-vpc.id
  tags = {
    Name = "userapp-private-route"
  }

  route {
    cidr_block = aws_vpc.userapp-vpc.cidr_block
    gateway_id = "local"
  }

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.userapp-ngw.id
  }
}


resource "aws_route_table_association" "userapp-public_subnet-route-association" {
    for_each = aws_subnet.userapp-public-subnet
    subnet_id = each.value.id
    route_table_id = aws_route_table.userapp-public-route.id
}


resource "aws_route_table_association" "userapp-private_subnet-route-association" {
    for_each = aws_subnet.userapp-private-subnet
    subnet_id = each.value.id
    route_table_id = aws_route_table.userapp-private-route.id
}
