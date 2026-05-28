---
title: CDK for Terraform でVPCを構築するチュートリアル
date: 2020-07-23
description: CDK for Terraform でVPCを構築するチュートリアルです
tags: ['Terraform', 'TypeScript']
---

CDK for Terraform のチュートリアルを TypeScript で試してみました。  
[CDK for Terraform: Enabling Python & TypeScript Support](https://www.hashicorp.com/blog/cdk-for-terraform-enabling-python-and-typescript-support/)

## Terraformのインストール
[Install Terraform \| Terraform - HashiCorp Learn](https://learn.hashicorp.com/terraform/getting-started/install.html)

```shell
$ brew install terraform
```

## CDK for terraform のインストール

```shell
$ yarn global add cdktf-cli
```

## AWSでVPCを構築するチュートリアル

### プロジェクトの作成
Terraform Cloud でリモートステートを管理するか聞かれるので "no" とする。

```shell
$ mkdir vpc-example
$ cd vpc-example
$ cdktf init --template=typescript
...
Do you want to continue with Terraform Cloud remote state management (yes/no)? no
Project Name: (default: 'vpc-example')
Project Description: (default: 'A simple getting started project for cdktf.')
```

### 実装
TerraformのHCLと比較すると、型のおかげで必須オプションの漏れなどが、リアルタイムで分かるのは良いですね。

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

### TerraformのJSONファイルを生成
TypeScriptのコードからTerraformのJSON形式の設定ファイルをに生成します。ファイルは`cdk.tf`ディレクトリに出力されます。

```shell
$ cdktf synth
Generated Terraform code in the output directory: cdktf.out

$ tree cdktf.out
cdktf.out
└── cdk.tf.json
```

### Terraformを実行
生成された設定ファイルを元に terraform を実行することで、AWSにVPCを構築できます。  
設定がまだの場合は事前に `aws configure` で設定を完了させておく必要があります。

AWSコンソールのVPCを確認すれば、新しくリソースが作成されている事が確認できます。

```shell
$ cd cdktf.out
$ terraform init
$ terraform plan
...
# 追加されるVPCの情報が表示される

$ terraform apply
aws_vpc.vpcexample_myvpc_80A1790F: Creating...
aws_vpc.vpcexample_myvpc_80A1790F: Still creating... [10s elapsed]
aws_vpc.vpcexample_myvpc_80A1790F: Creation complete after 10s [id=vpc-09aeca6257ae5fe31]
aws_subnet.vpcexample_mysubnet_3769B309: Creating...
aws_subnet.vpcexample_mysubnet_3769B309: Creation complete after 3s [id=subnet-0264b990708ed4f69]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

### リソースの削除
最後に今回のチュートリアルで作成したVPCを削除しておきます。

```
$ terraform destroy
```