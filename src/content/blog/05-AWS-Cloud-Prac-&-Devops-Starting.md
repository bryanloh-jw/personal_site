---
title: 'Getting the AWS Cloud Pracititioner & Starting Devops'
date: 2026-06-05
excerpt: 'My first step into the world of devops'
tags: ['security', 'devops', 'learning', 'AWS']
draft: false
---

Through my career, I never had the need to learn about deployment and using the cloud. Anything past writing code and git branches was handled by the specialized devops team.

Its about time that changed, and I'm starting my journey to learn more about devops and the cloud environment and experience how security can be maintained through the process.

## AWS Cloud Pracititioner Exam

I knew I wanted to take this exam as an introduction to what cloud has to offer. Even though it is a foundational certification, I was exposed to many AWS services and methodology at a high level. There were tons of resoruces online to learn the concepts and I found the practice tests really useful to understand my knowledge gaps and to know where to revise.

## Personal Site

I decided to create a personal site to dip my toes into devops and the cloud.

The project infrastructure is a digital ocean droplet. The static site is running in a docker container and beign served by nginx. Caddy is used for reverse proxy as well as providing automatic TLS encryption for HTTPS.

Astro is used for content management as it is a simple platform to quickly get a site running, as building the site is not the main point of the project.

### Devops?

These are some things I did to learn about devops in this project:

1. First started by manually building the site, copying it to the droplet and manually running and hosting it by opening port 80 on the firewall.

2. Added precommit using `lefthook` for linting

3. Used github actions to automate checks and deployment at different stages such as pull request and merge (reference `.github/workflow` directory)

### Pipeline

![Precommit & Github Actions](/05/015-blog.png)

Above picture shows what happen during the different stages of the project deployment.

There were a few problems I noticed about this, and that I would fix in the future:

- building checks are not done until merge, deployment can fail and be out of sync with main

- linting on PR fails when local linting works fine

- no notification of success of failure (I was running an old version of the site because I didn't know deployment failed)

These are my proposed fix for the issues:

- building the container should be tested during PR to ensure no issues with deployment

- move checks earlier

- setup notification of deployment status

There are many other things I can do with the pipeline, but this is a simple static site and a simple production environment.

## Conclusion

Overall, I think this is a great introduction into cloud and devops and I would want to learn more in the future with additional projects.

I've also finished the book `The Pheonix Project` and am getting started with `Devops Handbook`. The Pheonix Project is a great book and I really related to how integrating dev and ops in an organization would make IT function operate much more efficiently to fulfil business objectives.
