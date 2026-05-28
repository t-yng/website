---
title: Tutorial - build a VPC with CDK for Terraform
date: 2020-07-23
description: A tutorial for building a VPC using CDK for Terraform
tags: ['Terraform', 'TypeScript']
---

I tried the CDK for Terraform tutorial using TypeScript.
[CDK for Terraform: Enabling Python & TypeScript Support](https://www.hashicorp.com/blog/cdk-for-terraform-enabling-python-and-typescript-support/)

## Install Terraform

[Install Terraform | Terraform - HashiCorp Learn](https://learn.hashicorp.com/terraform/getting-started/install.html)

```shell
$ brew install terraform
```

## Install CDK for Terraform

```shell
$ yarn global add cdktf-cli
```

## Tutorial: build a VPC on AWS

### Create the project

When asked if you want to use Terraform Cloud for remote state management, answer "no".

```shell
$ mkdir vpc-example
$ cd vpc-example
$ cdktf init --template=typescript
...
Do you want to continue with Terraform Cloud remote state management (yes/no)? no
Project Name: (default: 'vpc-example')
Project Description: (default: 'A simple getting started project for cdktf.')
```

### Implementation

Compared to Terraform HCL, the TypeScript types help you catch missing required options in real time. This is very helpful.

```typescript
import { Construct } from 'constructs';
import { App, TerraformStack, Token } from 'cdktf';
import { Vpc } from './.gen/providers/aws/vpc';
import { Subnet } from './.gen/providers/aws/subnet';
import { AwsProvider } from './.gen/providers/aws'

class MyStack extends TerraformStack {
 constructor(scope: Construct, name: string) {
   super(scope, name);

   new AwsProvider(this, 'aws', {
     region: 'ap-northeast-1'
   });

   const vpc = new Vpc(this, 'my-vpc', {
     cidrBlock: '10.0.0.0/16'
   });
    new Subnet(this, 'my-subnet', {
     vpcId: Token.asString(vpc.id),
     cidrBlock: '10.0.0.0/24'
   });
 }
}

const app = new App();
new MyStack(app, 'vpc-example');
app.synth();
```

### Generate Terraform JSON files

This command generates Terraform JSON config files from the TypeScript code. The files are output to the `cdk.tf` directory.

```shell
$ cdktf synth
Generated Terraform code in the output directory: cdktf.out

$ tree cdktf.out
cdktf.out
└── cdk.tf.json
```

### Run Terraform

Run terraform with the generated config file to build the VPC on AWS.
If you haven't configured AWS yet, run `aws configure` first.

You can check the AWS Console VPC page to confirm that the new resources were created.

```shell
$ cd cdktf.out
$ terraform init
$ terraform plan
...
# Information about the VPC to be added is shown

$ terraform apply
aws_vpc.vpcexample_myvpc_80A1790F: Creating...
aws_vpc.vpcexample_myvpc_80A1790F: Still creating... [10s elapsed]
aws_vpc.vpcexample_myvpc_80A1790F: Creation complete after 10s [id=vpc-09aeca6257ae5fe31]
aws_subnet.vpcexample_mysubnet_3769B309: Creating...
aws_subnet.vpcexample_mysubnet_3769B309: Creation complete after 3s [id=subnet-0264b990708ed4f69]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

### Delete resources

Finally, delete the VPC created in this tutorial.

```
$ terraform destroy
```
