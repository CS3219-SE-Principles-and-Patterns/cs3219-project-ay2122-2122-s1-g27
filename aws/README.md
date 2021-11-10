# AWS Deployment

To follow the instructions, update the variables with your own endpoints / credentials as you see fit. Ensure you have aws-cli installed to run scripts
*Warning: WIP*


# 1. Build and Push Docker Images to ECR
First, create the repositories there, then run `sh buildPushImages.sh` to build and push them there.

# 2. Launch ECS Cluster using CloudFormation
Run the following command to deploy
```
aws cloudformation deploy \
   --template-file ecs.yml \
   --region [region] \
   --stack-name PeerPrep-Cluster
```

Check that your cluster is running

# 3. Configure Task Defintion
Create a task definition for the following 4 services - `collab`, `comm`, `question`, `user`. You may use the ones in `/taskDefintions` as JSON imported template

# 4. Create target groups for services
For each service, create the target groups by running the `createTargetGroup.sh` script

# 5. Configure Listener Rules
Forward API and socket requests


# 6. Launch Services
For each service, select the task definition, enter the number of tasks, configure auto-scaling and load balancer for the application load balancer earlier configured. 