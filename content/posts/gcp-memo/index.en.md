---
title: Study notes for the Professional Cloud Developer certification exam
date: 2023-01-08
description: Notes I wrote while studying for Google's Professional Cloud Developer certification exam
tags: ['Other', 'GCP']
---

These are my notes from studying GCP in order to [pass the Professional Cloud Developer certification](/post/pass-pcd).

## App Engine Flexible Environment

- Security updates to the underlying infrastructure are applied automatically
- SSH access to instances is possible if needed (disabled by default)
- For apps with large traffic spikes, consider the Standard environment
  - Requires App Engine Standard API
  - Cannot run on GKE, Compute Engine, or the Flexible environment

## Cloud Run

- Runs any container in response to HTTP requests

## Google Cloud Operations Suite

- Cloud Logging
  - The Logging agent is based on fluentd
- Cloud Monitoring
- Error Reporting
  - View errors that occurred in the application
  - Stack Trace shows the location of the error
  - Cloud Debugger appears and lets you navigate to the problematic code
- Cloud Trace
  - A distributed tracing system that collects latency data from applications
  - Analyzes applications and generates detailed reports on latency causing performance issues
  - Supports Java, Node.js, Ruby, Go
- Cloud Debugger
  - Takes a snapshot of the app's state including local variables
- Cloud Profiler
  - Monitors CPU and heap usage
  - Helps improve bottlenecks and reduce resource consumption
  - Shows which paths and code are consuming resources
  - Supports Java, Node.js, Go, Python
- Google Performance Management (APM) tools
  - Made up of three services: Cloud Trace, Cloud Debugger, Cloud Profiler
  - Works independent of infrastructure or cloud — also works on AWS and on-premises
  - Pricing based on the amount of data collected — free tier available

## IAM member types

- Google Account
- Service Account
  - A special Google account that belongs to an application or VM instance, not an individual user. Use service accounts to call Google APIs for a service.
- Google Group
- G Suite domain
- Cloud Identity domain
- Resources
  - Projects
  - Pub/Sub topics
  - GCP instances
  - etc.
- Permissions determine what operations can be performed on a resource
- Permissions are defined in the format `<service>.<resource>.<verb>`
  - Example: pubsub.topics.publish

## Cloud Identity-Aware Proxy

Use this when you need to allow access to an application without requiring users to log into a VPN.

## Cloud Pub/Sub

- Use cases
  - Real-time gaming applications
  - Click-stream data injection and processing
  - Processing device and sensor data in healthcare and manufacturing
- For large-scale data, Cloud Pub/Sub I/O can be used for exactly-once processing
  - Duplicate messages can be discarded based on a custom message ID or the ID assigned by Cloud Pub/Sub
- Message order is not guaranteed
- Works well when message processing order does not matter

## Cloud Endpoints

- Deploy APIs to GCP and expose them to end users
  - Can create an API gateway
- Cloud Functions should be used as internal endpoints within a system

## API Explorer

- A sandbox environment where you can try Google Cloud APIs
  - Search and test methods within APIs

## Data storage options

- Cloud Storage
- Cloud Datastore
- Cloud Bigtable
- Cloud SQL
- Cloud Spanner
- BigQuery

### Cloud Storage

- Best for unstructured data like images, videos, objects, and blobs
- Objects can be accessed via HTTP
- Made up of buckets and objects
- Can be managed with the gsutil command
- Four storage classes exist:
  - Standard: 99.9%+ availability (multi-region), best for website data and streaming mobile apps
  - Nearline: 99.5% (multi-region), 99.9% (regional), retrieval fee applies, minimum 30-day storage, best for long-term content backups
  - Coldline: 99.5% (multi-region), 99.9% (regional), higher retrieval fee than Nearline, minimum 90-day storage
  - Archive: 99.5% (multi-region), 99.9% (regional), highest retrieval fee, minimum 365-day storage, best for disaster recovery and data archiving
- Access can be controlled with ACL (Access Control Lists)
  - Only used in Cloud Storage
  - Defines users with access to buckets and objects, and their access level
  - IAM permissions apply to all objects in a bucket
  - Use ACLs when you need to control access to individual objects in a bucket

### Cloud Datastore

- Fully managed NoSQL document database
- A more feature-rich version of Bigtable
- Best for high-value app data like user profiles and shopping cart orders
- Creating unnecessary indexes increases latency for consistency and also increases storage cost
- By default, all properties are indexed
- Composite indexes must be created when searching by multiple properties

### Cloud Bigtable

- High-performance NoSQL database
- Can store terabytes to petabytes of data
- Ideal for storing single-key very large data or MapReduce operations

### Cloud SQL

- GCP's managed relational database service
- Cloud SQL Proxy allows secure connections without needing to whitelist IP addresses
  - The proxy requires a valid user account to be specified
- Best for apps using MySQL or PostgreSQL

### Cloud Spanner

- Fully managed relational database service
- Provides strong consistency and horizontal scalability
- Designed for mission-critical OLTP applications
- Best for structured and semi-structured relational data requiring high availability, strong consistency, and transactional reads and writes

### BigQuery

A low-cost, fully managed data warehouse for analysis.

### Truncated exponential backoff

Truncated exponential backoff is a standard way to handle errors in network applications. The client retries failed requests at increasing intervals between each retry.

In simple terms, it is a method of increasing the wait time before retrying based on the number of failures.

Reference: [A note on exponential backoff with a minimal implementation](https://ebc-2in2crc.hatenablog.jp/entry/2020/12/19/220801)

## IAM

### Service account

A special Google account attached to an application or VM.

## GKE

Helps deploy, manage, and scale a Kubernetes environment for containerized applications on GCP.
Node: A VM in the cluster that hosts containers.

### Union file system (UnionFS)

UnionFS is a file system service for Linux and FreeBSD that can transparently overlay (merge) files and directories from multiple different file systems (called branches), forming a single virtual file system.

Used in Linux containers to efficiently encapsulate applications and dependencies in a series of clean and minimal layers.

## Compute options

### Compute Engine

- Full control over infrastructure
- Easy to customize OS or migrate from on-premises
- Best when other options are not suitable

### App Engine

- Fully managed app platform, no server management or deploy configuration needed
- Focus on building the app without worrying about deployment
- Supports container workloads
- Logging available with StackDriver
- Suitable for websites, mobile app and game servers, exposing REST APIs

### GKE

- Container orchestration service that enhances the Kubernetes environment on GCP
- Easily move existing workloads running on on-premises clusters to GCP
- Suitable for containerized apps, cloud-native distributed systems, hybrid apps

### Cloud Run

- A managed platform that runs stateless containers in response to HTTP requests or Pub/Sub events
- Allows deploying stateless containers that listen for HTTP requests or events

### Cloud Functions

- Event-driven serverless service that processes single-purpose functions attached to events
- Sometimes used as part of sentiment analysis

## Kubernetes

### Kubernetes concepts

- Kubernetes manages objects that represent the desired and current state of elements running in the cluster
- Objects are defined as persistent entities representing the desired and current state of cluster elements
- Each object has a type called a "kind" in Kubernetes
- A Pod is the smallest deployable Kubernetes object and represents the environment where containers exist
- Multiple containers in a Pod can share resources like networking and storage
- All running containers exist inside Pods

### Kubernetes control plane

- Computers in the cluster that coordinate the entire cluster
- Multiple important Kubernetes components run in the control plane
- kube-APIserver: the single component you interact with directly
  - Accepts commands to start Pods or view/change cluster state
  - Accessible via the kubectl command
- etcd: stores the cluster state

### GKE concepts

- Build can be automated with the kubeadm command
- GKE handles all provisioning and management of the underlying control plane infrastructure
- Regional clusters span multiple zones, increasing availability
- Each zone has a control plane
- Control planes are not accessible from outside; accessible from internal IP addresses
- Authorized external IP access is also possible

### Kubernetes object management

- Define controller objects to manage Pods: Deployment, StatefulSet, DaemonSet, Job
- Namespaces allow building multiple virtual clusters on a physical cluster
- Used for dev and production environments, etc.

### kubectl

- Utility for controlling Kubernetes clusters
- Sends HTTP requests to kube-apiserver and displays the responses
- Requires authentication credentials
- `gcloud get-credentials` retrieves the credentials needed to connect to a GKE cluster
- Command format: `kubectl [command] [type] [name] [flags]`

### Istio

- A service networking layer that provides transparent, language-independent means to automate application networking functions flexibly and easily
- An open-source service mesh that enables organizations to run distributed microservice-based applications anywhere
- Why use Istio:
  - Enables organizations to secure, connect, and monitor microservices, allowing rapid and secure modernization of enterprise apps

### Volume

#### emptyDir

Ephemeral — its lifetime is the same as the Pod's lifecycle.

#### ConfigMap

- An API object used to store non-confidential data as key-value pairs
- Pods can use ConfigMaps as environment variables, command-line arguments, or config files in a volume
- ConfigMaps let you separate environment-specific configuration from container images, making apps more portable

#### Secret volume

- Stores sensitive information
- Based on an in-memory file system

#### downwardAPI volume

- A volume for making the downwardAPI available
- The downwardAPI is how containers can learn about the Pod environment

### Vertical pod autoscaling

GKE's Vertical Pod Autoscaling automatically adjusts container resources (CPU/RAM) for Pods.

### Horizontal pod autoscaling

GKE's Horizontal Pod Autoscaling automatically adjusts the number of Pods based on container resource (CPU/RAM) usage or custom metrics.

### PersistentVolume

A highly durable persistent storage resource managed at the cluster level.

### Knative

- A Kubernetes-based platform for building, deploying, and managing modern serverless workloads
- Provides a set of essential components for building and running serverless applications on Kubernetes

## Networking

### Carrier peering

Carrier peering is used to access Google applications like Google Workspace through a service provider and connect infrastructure to Google with enterprise-class network services.

### VPC network peering

- VPC Network Peering allows workloads in different VPC networks to communicate in private (RFC 1918) space
- Traffic stays within Google's network and does not go through the public internet

### Shared VPC network

Shared VPC connects resources from multiple projects in an organization to a common VPC network for secure and efficient communication using that network's internal IPs.

### Private Google Access

Private Google Access is available per subnet. When enabled, instances in the subnet can communicate with public Google API endpoints even without an external IP address.

### Identity-Aware Proxy (IAP)

IAP authenticates users rather than protecting the communication channel. Technically, the channel is already protected by Cloud Load Balancing, but appropriate certificates are not used.
- Controls access to cloud-based and on-premises applications and VMs running on Google Cloud
- Verifies user identity and uses context to decide whether to grant access
