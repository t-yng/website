---
title: Looking back at my study for the Google Professional Cloud Developer exam
date: 2023-01-08
description: A review of what I did to pass the Google Professional Cloud Developer certification exam.
tags: ['Other', 'GCP']
---

I recently passed Google's Professional Cloud Developer certification exam.
This is a review of what I did to pass the exam.

## What is Professional Cloud Developer (PCD)?

[Professional Cloud Developer](https://cloud.google.com/certification/cloud-developer) is a certification that proves you have the knowledge to build scalable, highly available applications using Google's recommended tools (mainly GCP) and best practices.

The exam tests the following skills:
- Designing cloud-native applications with high scalability, availability, and reliability
- Building and testing applications
- Deploying applications
- Integrating Google Cloud services
- Managing deployed applications

## Why I took the exam

I was invited to join a company program called G.I.G, which helps engineers build technical skills with Google Cloud. As part of completing this program, I needed to get a Google Cloud certification.

I had been wanting to study GCP properly for a while, so I took this as a good opportunity to take the certification exam.

## My development experience

### Implementation and design experience
- Server-side development: 2.5 years
- Frontend development: 3 years

### Infrastructure experience
- Built and operated infrastructure using Terraform + AWS Fargate for running Next.js in production
  - There was an existing base, so I copied it and built it while consulting with people who knew it
- Built APIs using Node.js + Lambda
- Familiar with basic AWS services
- Had little experience with GCP and was a bit afraid of it — couldn't even navigate the GCP console

## How I studied

### Study time and duration

Study time: about 60 hours
Study period: 2 months

The total study time was about 60 hours, but about 1/4 of that was spent on hands-on labs required to complete the Coursera courses. So the actual time spent on pure studying was about 45 hours.

### Coursera

I took and completed 5 Coursera courses for PCD exam candidates, provided for G.I.G program participants. The content was video-based learning about GCP and hands-on practice with Qwiklabs.

Just watching the videos wasn't enough for me to remember things, so while watching the videos I wrote notes about the important points. When I encountered words or service names I didn't understand, I looked them up in the documentation or other people's blog posts. This approach felt much more effective than just watching the videos.

You can find my notes in [Study Notes for the Professional Cloud Developer Exam](/post/gcp-memo).

I took the following courses. They are also open to the public, so anyone can take them.
- [Google Cloud Fundamentals: Core Infrastructure (Japanese)](https://www.coursera.org/learn/gcp-fundamentals-jp)
- [Application Deployment, Debug, Performance (Japanese)](https://www.coursera.org/learn/app-deployment-debugging-performance-jp)
- [Securing and Integrating Components of your Application (Japanese)](https://www.coursera.org/learn/securing-integrating-components-app-jp)
- [Getting Started with Application Development (Japanese)](https://www.coursera.org/learn/getting-started-app-development-jp)
- [Getting Started with Google Kubernetes Engine (Japanese)](https://www.coursera.org/learn/google-kubernetes-engine-jp)

### Practice exam

After finishing all the Coursera courses, I worked through the [official practice exam](https://docs.google.com/forms/d/e/1FAIpQLSc_67KaPnNwQrLZ7kuhw-aubz7gMAwY6DQwRJYcW0qlG-iajA/viewform?hl=ja). For every service name or word I didn't know, I looked it up and made sure I understood it. After that, I kept taking the practice exam until I could explain each answer from memory.

## Difficulty and impressions

Since it is a multiple-choice exam, I thought that if I just learned the GCP services, I could answer the system design questions using common sense from experience — and that was pretty much how it went.

My impression was that the exam is not that hard if you have a reasonable amount of server-side development experience, including design. In particular, if you use GCP at work, I think you can pass just by taking the practice exam to get a feel for the test style and doing a bit of studying.
